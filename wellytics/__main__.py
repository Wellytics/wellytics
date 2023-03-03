import json
import threading

from queue import Queue
from pydantic import BaseModel
from transformers import pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import initialize_app, firestore, credentials

from wellytics.utils import uuid

firebase_credentials = credentials.Certificate("credentials.json")
firebase_app = initialize_app(firebase_credentials)
firestore = firestore.client()

flask_app = Flask(__name__)
CORS(flask_app)

_keywords_threshold = 0.7
_emotions_threshold = 0.7

_keywords_model = "yanekyuk/bert-uncased-keyword-extractor"
_emotions_model = "joeddav/distilbert-base-uncased-go-emotions-student"

_keywords_pipeline = pipeline("ner", model=_keywords_model)

_emotions_pipeline = pipeline(
    "text-classification",
    model=_emotions_model,
    return_all_scores=True,
)


def _get_keywords(text: str):
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
    outputs = [output["word"] for output in outputs]

    return outputs


def _get_emotions(text: str):
    outputs = _emotions_pipeline(text)[0]
    outputs = sorted(outputs, reverse=True, key=lambda x: x["score"])

    return outputs


_jobs: dict[str, "Job"] = {}
_job_lock = threading.Lock()

_keywords_queue = Queue()
_emotions_queue = Queue()


keywordable_types = [
    "ShortAnswer",
    "LongAnswer",
]


class Job(BaseModel):
    id: str
    status: str
    result: dict | None


class KeywordsThread(threading.Thread):
    _stop: threading.Event

    def __init__(self):
        super().__init__()
        self._stop = threading.Event()

    def stop(self):
        self._stop.set()

    def stopped(self):
        return self._stop.is_set()

    def run(self):
        while True:
            if self.stopped():
                return

            item = _keywords_queue.get()
            job_id = item["job_id"]
            texts = item["texts"]

            result = [_get_keywords(text) for text in texts]

            with _job_lock:
                job = _jobs[job_id]
                job.result = result
                job.status = "finished"


class EmotionsThread(threading.Thread):
    _stop: threading.Event

    def __init__(self):
        super().__init__()
        self._stop = threading.Event()

    def stop(self):
        self._stop.set()

    def stopped(self):
        return self._stop.is_set()

    def run(self):
        while True:
            if self.stopped():
                return

            item = _emotions_queue.get()
            job_id = item["job_id"]
            texts = item["texts"]

            result = [_get_emotions(text) for text in texts]

            with _job_lock:
                job = _jobs[job_id]
                job.result = result
                job.status = "finished"


_keywords_thread = KeywordsThread()
_keywords_thread.start()

_emotions_thread = EmotionsThread()
_emotions_thread.start()


def _get_forms():
    forms_ref = firestore.collection("forms")
    forms = forms_ref.stream()
    forms = [form.to_dict() for form in forms]
    return forms


def _get_form(form_id: str):
    form_ref = firestore.collection("forms").document(form_id)
    form = form_ref.get().to_dict()
    return form


def _get_responses(form_id: str):
    responses_ref = firestore.collection(form_id)
    responses = responses_ref.stream()
    responses = [response.to_dict() for response in responses]
    for response in responses:
        response["answers"] = json.loads(response["answers"])
    return responses


@flask_app.route("/forms", methods=["GET", "POST"])
def create_or_get_forms():
    def create_form():
        form = request.get_json()
        firestore.collection("forms").document(form["id"]).set(form)
        return jsonify(True)

    def get_forms():
        return jsonify(_get_forms())

    return create_form() if request.method == "POST" else get_forms()


@flask_app.route("/forms/<form_id>", methods=["GET"])
def get_form(form_id: str):
    return jsonify(_get_form(form_id))


@flask_app.route("/forms/<form_id>/responses", methods=["GET", "POST"])
def create_or_get_responses(form_id: str):
    def create_response():
        response = request.get_json()
        response["answers"] = json.dumps(response["answers"])
        firestore.collection(form_id).document(response["id"]).set(response)
        return jsonify(True)

    def get_responses():
        return jsonify(_get_responses(form_id))

    return create_response() if request.method == "POST" else get_responses()


@flask_app.route("/forms/<form_id>/responses/keywords", methods=["GET"])
def get_keywords(form_id: str):
    responses = _get_responses(form_id)
    answers = []
    for response in responses:
        answers.extend(
            [
                answer
                for answer in response["answers"]
                if answer["type"] in keywordable_types
            ]
        )

    texts = [answer["answer"] for answer in answers]

    job_id = uuid()

    with _job_lock:
        _jobs[job_id] = Job(id=job_id, status="running", result=None)
        _keywords_queue.put({"job_id": job_id, "texts": texts})

    return jsonify(job_id)


@flask_app.route("/forms/<form_id>/responses/emotions", methods=["GET"])
def get_emotions(form_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/summary", methods=["GET"])
def get_summary(form_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>", methods=["GET"])
def get_response(form_id: str, response_id: str):
    response_ref = firestore.collection(form_id).document(response_id)
    response = response_ref.get().to_dict()
    response["answers"] = json.loads(response["answers"])
    return jsonify(response)


@flask_app.route("/forms/<form_id>/responses/<response_id>/keywords", methods=["GET"])
def get_response_keywords(form_id: str, response_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>/emotions", methods=["GET"])
def get_response_emotions(form_id: str, response_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>/summary", methods=["GET"])
def get_response_summary(form_id: str, response_id: str):
    pass


@flask_app.route("/jobs/<job_id>", methods=["GET"])
def get_job(job_id: str):
    with _job_lock:
        job = _jobs[job_id].dict()
    return jsonify(job)


if __name__ == "__main__":
    flask_app.run(threaded=True)
