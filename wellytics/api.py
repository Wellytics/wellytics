import time

from typing import List
from firebase_admin import initialize_app, firestore, credentials
from firebase_admin.firestore import ArrayUnion
from pydantic import BaseModel
from threading import Thread

from wellytics.utils import uuid, _map
from wellytics.processing import (
    _job_lock,
    _jobs,
    _jobs_queue,
    _orchestrator_thread,
)
from wellytics.models import (
    Form,
    FormAnalytics,
    FormAnalyticsCollection,
    FormSnapshot,
    Job,
    JobStatus,
    JobType,
    Metric,
    Question,
    Response,
    ResponseAnalytics,
    ResponseAnalyticsCollection,
    ResponseSnapshot,
)

firebase_credentials = credentials.Certificate("credentials.json")
firebase_app = initialize_app(firebase_credentials)
firestore = firestore.client()

_orchestrator_thread.start()


def _response_snapshot(response_snapshot) -> ResponseSnapshot:
    response_dict = response_snapshot.to_dict()

    metric_snapshots = _map(lambda x: x.get(), response_dict.get("metrics", []))
    metric_dicts = _map(lambda x: x.to_dict(), metric_snapshots)
    metrics = _map(lambda x: Metric(**x), metric_dicts)

    response_dict["metrics"] = metrics

    return ResponseSnapshot(**response_dict)


def _form_snapshot(form_snapshot) -> FormSnapshot:
    form_dict = form_snapshot.to_dict()

    questions_snapshot = _map(lambda x: x.get(), form_dict.get("questions", []))
    questions_dict = _map(lambda x: x.to_dict(), questions_snapshot)
    questions = _map(lambda x: Question(**x), questions_dict)

    form_dict["questions"] = questions

    return FormSnapshot(**form_dict)


def _create_job_skeleton_document(collection: str, id: str, job_id: str, **kwargs):
    now = int(time.time())
    (
        firestore.collection(collection)
        .document(id)
        .set(
            {
                "id": id,
                "createdAt": now,
                "updatedAt": now,
                "status": JobStatus.Pending,
                "jobId": job_id,
                **kwargs,
            }
        )
    )


def _create_job_callback(collection: str, id: str, _callback: callable = None):
    def callback(error: bool, response: BaseModel):
        document_ref = firestore.collection(collection).document(id)
        if error:
            print(error, response)
            document_ref.update({"status": JobStatus.Error})
            return

        if _callback:
            _thread = Thread(target=_callback, args=(response,))
            _thread.start()

        document_ref.update({**response.dict(), "status": JobStatus.Finished})

    return callback


def _create_job(collection: str, id: str, type: str, payload: dict, **kwargs):
    job_id = uuid()
    _callback = kwargs.pop("_callback", None)
    callback = _create_job_callback(collection, id, _callback=_callback)
    job = Job(
        id=job_id,
        type=type,
        status=JobStatus.Pending,
        payload=payload,
        result=None,
        callback=callback,
    )

    with _job_lock:
        _jobs[job_id] = job

    _jobs_queue.put(job)

    _create_job_skeleton_document(
        collection,
        id,
        job_id,
        **kwargs,
    )

    return job_id


def _create_response_analytics_job(form_id: str, response_id: str) -> str:
    def _callback(response: ResponseAnalytics):
        now = int(time.time())
        for _, emotions in response.emotions.items():
            emotions = {emotion.label: emotion.score for emotion in emotions}
            metric = Metric(
                id=uuid(),
                createdAt=response.createdAt,
                updatedAt=now,
                trackingId=response.trackingId,
                values=emotions,
            )
            create_metric(form_id, response_id, metric)

    form = get_form(form_id)
    response = get_response(form_id, response_id)

    job_id = _create_job(
        ResponseAnalyticsCollection,
        response_id,
        JobType.ResponseAnalytics,
        {"form": form, "response": response},
        formId=form_id,
        trackingId=response.trackingId,
        _callback=_callback,
    )

    return job_id


def _create_form_analytics_jobs(form_id: str) -> str:
    def _callback(response: FormAnalytics):
        now = int(time.time())
        for responseAnalytics in response.responseAnalytics:
            document_ref = firestore.collection(ResponseAnalyticsCollection).document(
                responseAnalytics.id
            )
            document_ref.set({**responseAnalytics.dict(), "status": JobStatus.Finished})

            for _, emotions in responseAnalytics.emotions.items():
                emotions = {emotion.label: emotion.score for emotion in emotions}
                metric = Metric(
                    id=uuid(),
                    createdAt=responseAnalytics.createdAt,
                    updatedAt=now,
                    trackingId=responseAnalytics.trackingId,
                    values=emotions,
                )
                create_metric(form_id, responseAnalytics.id, metric)

    form = get_form(form_id)
    responses = get_responses(form_id)

    job_id = _create_job(
        FormAnalyticsCollection,
        form_id,
        JobType.FormAnalytics,
        {"form": form, "responses": responses},
        formId=form_id,
        _callback=_callback,
    )

    return job_id


def create_metric(form_id: str, response_id: str, metric: Metric):
    metric_ref = firestore.collection("metrics").document(metric.id)
    metric_ref.set(metric.dict())

    response_ref = firestore.collection(form_id).document(response_id)
    response_ref.update({"metrics": ArrayUnion([metric_ref])})


def get_form(form_id: str) -> FormSnapshot:
    return _form_snapshot(firestore.collection("forms").document(form_id).get())


def get_responses(form_id: str) -> List[ResponseSnapshot]:
    response_snapshots = firestore.collection(form_id).stream()
    return _map(_response_snapshot, response_snapshots)


def get_response(form_id: str, response_id: str) -> ResponseSnapshot:
    return _response_snapshot(firestore.collection(form_id).document(response_id).get())


def get_form_analytics(form_id: str, force: bool = False) -> FormAnalytics:
    cached_analytics_ref = firestore.collection(FormAnalyticsCollection).document(
        form_id
    )
    cached_analytics_snapshot = cached_analytics_ref.get()
    if (
        not cached_analytics_snapshot.exists
        or cached_analytics_snapshot.get("status") == JobStatus.Error
        or force
    ):
        _create_form_analytics_jobs(form_id)
        cached_analytics_snapshot = cached_analytics_ref.get()

    return FormAnalytics(**cached_analytics_snapshot.to_dict())


def get_response_analytics(
    form_id: str, response_id: str, force: bool = False
) -> ResponseAnalytics:
    cached_analytics_ref = firestore.collection(ResponseAnalyticsCollection).document(
        response_id
    )
    cached_analytics_snapshot = cached_analytics_ref.get()
    if (
        not cached_analytics_snapshot.exists
        or cached_analytics_snapshot.get("status") == JobStatus.Error
        or force
    ):
        _create_response_analytics_job(form_id, response_id)
        cached_analytics_snapshot = cached_analytics_ref.get()

    return ResponseAnalytics(**cached_analytics_snapshot.to_dict())


def create_question(question: Question):
    firestore.collection("questions").document(question.id).set(question.dict())


def create_form(form: Form):
    question_refs = _map(
        lambda x: firestore.collection("questions").document(x),
        form.questions,
    )

    form_dict = form.dict()
    form_dict["questions"] = question_refs

    firestore.collection("forms").document(form.id).set(form_dict)


def create_response(response: Response):
    form_id = response.formId
    metric_refs = _map(
        lambda x: firestore.collection("metrics").document(x), response.metrics
    )

    response_dict = response.dict()
    response_dict["metrics"] = metric_refs

    firestore.collection(form_id).document(response.id).set(response_dict)


def add_question_to_form(form_id: str, question_id: str) -> None:
    question_ref = firestore.collection("questions").document(question_id)
    form_ref = firestore.collection("forms").document(form_id)
    form_ref.update({"questions": ArrayUnion([question_ref])})


def add_metric_to_response(form_id: str, response_id: str, metric_id: str) -> None:
    metric_ref = firestore.collection("metrics").document(metric_id)
    response_ref = firestore.collection(form_id).document(response_id)
    response_ref.update({"metrics": ArrayUnion([metric_ref])})


def patch_question(question_id: str, patch: dict) -> None:
    firestore.collection("questions").document(question_id).update(patch)


# TODO: If questions are not added to the form, add them
def patch_form(form_id: str, patch: dict) -> None:
    if "questions" in patch:
        questions = patch.pop("questions")
        _map(
            lambda question: patch_question(question["id"], question),
            questions,
        )

    firestore.collection("forms").document(form_id).update(patch)


def patch_metric(metric_id: str, patch: dict) -> None:
    firestore.collection("metrics").document(metric_id).update(patch)


# TODO: If metrics are not added to the response, add them
def patch_response(form_id: str, response_id: str, patch: dict) -> None:
    if "metrics" in patch:
        metrics = patch.pop("metrics")
        _map(
            lambda metric: patch_metric(metric["id"], metric),
            metrics,
        )
    firestore.collection(form_id).document(response_id).update(patch)
