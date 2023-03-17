import time

from typing import List
from firebase_admin import initialize_app, firestore, credentials
from firebase_admin.firestore import ArrayUnion
from pydantic import BaseModel

from wellytics.utils import uuid, _map, _find_index
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
    FormView,
    Job,
    JobStatus,
    JobType,
    Metric,
    Question,
    QuestionView,
    Response,
    ResponseAnalytics,
    ResponseAnalyticsCollection,
    ResponseSnapshot,
)

firebase_credentials = credentials.Certificate("credentials.json")
firebase_app = initialize_app(firebase_credentials)
firestore = firestore.client()

_orchestrator_thread.start()


# region Internal
def _response_snapshot(response_snapshot) -> ResponseSnapshot:
    response_dict = response_snapshot.to_dict()

    metric_snapshots = _map(lambda x: x.get(), response_dict["metrics"])
    metric_dicts = _map(lambda x: x.to_dict(), metric_snapshots)
    metrics = _map(lambda x: Metric(**x), metric_dicts)

    response_dict["metrics"] = metrics

    return ResponseSnapshot(**response_dict)


def _form_snapshot(form_snapshot) -> FormSnapshot:
    form_dict = form_snapshot.to_dict()

    questions_snapshot = _map(lambda x: x.get(), form_dict["questions"])
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


def _create_job_callback(collection: str, id: str):
    def callback(error: bool, response: BaseModel):
        document_ref = firestore.collection(collection).document(id)
        if error:
            print(error, response)
            document_ref.update({"status": JobStatus.Error})
            return

        document_ref.update({**response.dict(), "status": JobStatus.Finished})

    return callback


def _create_job(collection: str, id: str, type: str, payload: dict, **kwargs):
    job_id = uuid()
    callback = _create_job_callback(collection, id)
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
    form = get_form(form_id)
    response = get_response(form_id, response_id)

    job_id = _create_job(
        ResponseAnalyticsCollection,
        response_id,
        JobType.ResponseAnalytics,
        {"form": form, "response": response},
        formId=form_id,
        trackingId=response.trackingId,
    )

    return job_id


def _create_form_analytics_jobs(form_id: str) -> str:
    form = get_form(form_id)
    responses = get_responses(form_id)

    job_id = _create_job(
        FormAnalyticsCollection,
        form_id,
        JobType.FormAnalytics,
        {"form": form, "responses": responses},
        formId=form_id,
    )

    return job_id


# endregion


# region Create
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


def create_metric(metric: Metric):
    firestore.collection("metrics").document(metric.id).set(metric.dict())


def create_response(response: Response):
    form_id = response.formId
    metric_refs = _map(
        lambda x: firestore.collection("metrics").document(x), response.metrics
    )

    response_dict = response.dict()
    response_dict["metrics"] = metric_refs

    firestore.collection(form_id).document(response.id).set(response_dict)


# endregion


# region Get
def get_questions() -> List[QuestionView]:
    question_dicts = _map(
        lambda x: x.to_dict(),
        (
            firestore.collection("questions")
            .select(["createdAt", "updatedAt", "id", "type", "question"])
            .stream()
        ),
    )
    return _map(lambda x: QuestionView(**x), question_dicts)


def get_question(question_id: str) -> Question:
    question_snapshot = firestore.collection("questions").document(question_id).get()
    question_dict = question_snapshot.to_dict()
    return Question(**question_dict)


def get_forms(active: bool = True) -> List[FormView]:
    form_view_dicts = _map(
        lambda x: x.to_dict(),
        (
            firestore.collection("forms")
            .where("active", "==", active)
            .select(["active", "createdAt", "updatedAt", "id", "title", "description"])
            .stream()
        ),
    )
    return _map(lambda x: FormView(**x), form_view_dicts)


def get_form(form_id: str) -> FormSnapshot:
    return _form_snapshot(firestore.collection("forms").document(form_id).get())


def get_metrics() -> List[Metric]:
    metric_dicts = _map(
        lambda x: x.to_dict(),
        (firestore.collection("metrics").stream()),
    )
    return _map(lambda x: Metric(**x), metric_dicts)


def get_metric(metric_id: str):
    metric_snapshot = firestore.collection("metrics").document(metric_id).get()
    metric_dict = metric_snapshot.to_dict()
    return Metric(**metric_dict)


def get_responses(form_id: str) -> List[ResponseSnapshot]:
    response_snapshots = firestore.collection(form_id).stream()
    return _map(_response_snapshot, response_snapshots)


def get_response(form_id: str, response_id: str) -> ResponseSnapshot:
    return _response_snapshot(firestore.collection(form_id).document(response_id).get())


# TODO: Aggregate metrics
def get_form_metrics(form_id: str) -> List[Metric]:
    metric_snapshots = [
        metric_ref.get()
        for metrics_ref in firestore.collection(form_id).select(["metrics"]).stream()
        for metric_ref in metrics_ref.get("metrics")
    ]
    metric_dicts = _map(lambda x: x.to_dict(), metric_snapshots)
    return _map(lambda x: Metric(**x), metric_dicts)


def get_response_metrics(form_id: str, response_id: str) -> List[Metric]:
    response_snapshot = firestore.collection(form_id).document(response_id).get()
    response = _response_snapshot(response_snapshot)
    metrics = response.metrics
    return metrics


def get_tracking(tracking_id: str):
    metrics_dicts = [
        metric_ref.to_dict()
        for metric_ref in (
            firestore.collection("metrics")
            .where("trackingId", "==", tracking_id)
            .stream()
        )
    ]
    return _map(lambda x: Metric(**x), metrics_dicts)


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


# endregion


# region Add
def add_question_to_form(form_id: str, question_id: str) -> None:
    question_ref = firestore.collection("questions").document(question_id)
    form_ref = firestore.collection("forms").document(form_id)
    form_ref.update({"questions": ArrayUnion([question_ref])})


def add_metric_to_response(form_id: str, response_id: str, metric_id: str) -> None:
    metric_ref = firestore.collection("metrics").document(metric_id)
    response_ref = firestore.collection(form_id).document(response_id)
    response_ref.update({"metrics": ArrayUnion([metric_ref])})


# endregion


# region Patch
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


# endregion


# region Delete
def delete_form(form_id: str) -> None:
    firestore.collection("forms").document(form_id).delete()


def delete_response(form_id: str, response_id: str) -> None:
    firestore.collection(form_id).document(response_id).delete()


# endregion


# region Utils
def set_form_active(form_id: str, active: bool) -> None:
    firestore.collection("forms").document(form_id).update({"active": active})


def move_question_up(form_id: str, question_id: str, amount: int = 1) -> None:
    form_snapshot = firestore.collection("forms").document(form_id).get()
    question_refs = form_snapshot.get("questions")
    question_index = _find_index(lambda x: x.id == question_id, question_refs)
    if question_index == 0:
        return
    if question_index - amount < 0:
        amount = question_index
    question_refs[question_index], question_refs[question_index - amount] = (
        question_refs[question_index - amount],
        question_refs[question_index],
    )
    firestore.collection("forms").document(form_id).update({"questions": question_refs})


def move_question_down(form_id: str, question_id: str, amount: int = 1) -> None:
    form_snapshot = firestore.collection("forms").document(form_id).get()
    question_refs = form_snapshot.get("questions")
    question_index = _find_index(lambda x: x.id == question_id, question_refs)
    if question_index == len(question_refs) - 1:
        return
    if question_index + amount > len(question_refs) - 1:
        amount = len(question_refs) - 1 - question_index
    question_refs[question_index], question_refs[question_index + amount] = (
        question_refs[question_index + amount],
        question_refs[question_index],
    )
    firestore.collection("forms").document(form_id).update({"questions": question_refs})


# endregion
