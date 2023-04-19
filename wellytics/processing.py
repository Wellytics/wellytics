import threading
import time

from queue import Queue
from typing import Dict, List
from transformers import pipeline

from wellytics.models import (
    Emotion,
    FormAnalytics,
    FormSnapshot,
    Job,
    Keyword,
    Response,
    ResponseAnalytics,
    JobStatus,
    JobType,
)
from wellytics.utils import _find

_keywords_model = "./bert-uncased-keyword-extractor"
_emotions_model = "./distilbert-base-uncased-go-emotions-student"

_keywords_pipeline = None


def _load_keywords_model():
    global _keywords_pipeline
    _keywords_pipeline = pipeline(
        "ner",
        model=_keywords_model,
        tokenizer=_keywords_model,
    )


_emotions_pipeline = None


def _load_emotions_model():
    global _emotions_pipeline
    _emotions_pipeline = pipeline(
        "text-classification",
        model=_emotions_model,
        tokenizer=_emotions_model,
        return_all_scores=True,
    )


_jobs: dict[str, Job] = {}
_job_lock = threading.Lock()
_jobs_queue = Queue()


target_types = [
    "ShortAnswer",
    "LongAnswer",
]

target_emotions = [
    "caring",
    "approval",
    "disapproval",
    "realization",
    "remorse",
    "desire",
    "curiosity",
    "excitement",
    "pride",
    "confusion",
    "relief",
    "admiration",
    "surprise",
    "neutral",
    "grief",
    "annoyance",
    "anger",
    "fear",
    "optimism",
    "nervousness",
    "disgust",
    "joy",
    "gratitude",
    "embarrassment",
    "amusement",
    "sadness",
    "love",
    "disappointment",
]


def _get_keywords(text: str):
    if _keywords_pipeline is None:
        _load_keywords_model()

    outputs = _keywords_pipeline(text)
    outputs = sorted(outputs, key=lambda x: x["start"])

    _outputs = []
    for output in outputs:
        if len(_outputs) == 0:
            _outputs.append(output)
        else:
            last_merged_output = _outputs[-1]
            if output["start"] == last_merged_output["end"]:
                x = last_merged_output["word"].replace("#", "")
                y = output["word"].replace("#", "")
                last_merged_output["word"] = x + y
                last_merged_output["end"] = output["end"]
            else:
                _outputs.append(output)

    outputs = sorted(_outputs, reverse=True, key=lambda x: x["score"])
    outputs = [
        {"label": output["word"], "score": output["score"]} for output in outputs
    ]

    _seen = set()
    outputs = [
        output
        for output in outputs
        if output["label"] not in _seen and not _seen.add(output["label"])
    ]
    outputs = [Keyword(**output) for output in outputs]

    return outputs


def _get_emotions(text: str):
    if _emotions_pipeline is None:
        _load_emotions_model()

    outputs = _emotions_pipeline(text)[0]
    outputs = sorted(outputs, reverse=True, key=lambda x: x["score"])
    outputs = [Emotion(**output) for output in outputs]

    return outputs


class OrchestratorThread(threading.Thread):
    _stop: threading.Event

    def __init__(self):
        super().__init__()
        self._stop = threading.Event()

    def stop(self):
        self._stop.set()

    def stopped(self):
        return self._stop.is_set()

    def response_analytics_worker(
        self, job_id: str, payload: Dict
    ) -> ResponseAnalytics:
        form: FormSnapshot = payload["form"]
        response: Response = payload["response"]

        targets = list(
            map(
                lambda x: x.id,
                filter(lambda x: x.type in target_types, form.questions),
            )
        )

        emotions = {
            target: _get_emotions(response.answers[target]) for target in targets
        }

        keywords = {
            target: _get_keywords(response.answers[target]) for target in targets
        }

        now = int(time.time())

        return ResponseAnalytics(
            id=response.id,
            createdAt=now,
            updatedAt=now,
            status=JobStatus.Finished,
            jobId=job_id,
            formId=form.id,
            trackingId=response.trackingId,
            emotions=emotions,
            keywords=keywords,
        )

    def form_analytics_worker(self, job_id: str, payload: Dict):
        def mean(iterable):
            return sum(iterable) / len(iterable)

        form: FormSnapshot = payload["form"]
        responses: List[Response] = payload["responses"]

        response_analytics = [
            self.response_analytics_worker(
                f"{job_id}-{i}", {"form": form, "response": response}
            )
            for i, response in enumerate(responses)
        ]

        targets = list(
            map(
                lambda x: x.id,
                filter(lambda x: x.type in target_types, form.questions),
            )
        )

        # TODO: Remove duplicates while keeping the highest score
        keywords = {
            target: [
                keyword
                for response_analytics_item in response_analytics
                for keyword in response_analytics_item.keywords[target]
            ]
            for target in targets
        }

        emotions = {
            target: [
                Emotion(
                    label=target_emotion,
                    score=mean(
                        [
                            _find(
                                lambda x: x.label == target_emotion,
                                response_analytics_item.emotions[target],
                            ).score
                            for response_analytics_item in response_analytics
                        ]
                    ),
                )
                for target_emotion in target_emotions
            ]
            for target in targets
        }

        now = int(time.time())

        return FormAnalytics(
            id=form.id,
            formId=form.id,
            createdAt=now,
            updatedAt=now,
            status=JobStatus.Finished,
            jobId=job_id,
            responseAnalytics=response_analytics,
            emotions=emotions,
            keywords=keywords,
        )

    def work(self, job: Job):
        workers = {
            JobType.ResponseAnalytics: self.response_analytics_worker,
            JobType.FormAnalytics: self.form_analytics_worker,
        }

        worker = workers[job.type]
        error = False

        try:
            result = worker(job.id, job.payload)
        except Exception as exception:
            error = True
            result = exception
        finally:
            with _job_lock:
                job.result = result
                if error:
                    job.status = JobStatus.Error
                else:
                    job.status = JobStatus.Finished

            if job.callback:
                job.callback(error, result)

    def run(self):
        while True:
            if self.stopped():
                return

            job: Job = _jobs_queue.get()
            self.work(job)


_orchestrator_thread = OrchestratorThread()
