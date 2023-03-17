import wellytics.api as api

from flask import Flask, request, jsonify
from flask_cors import CORS

from wellytics.models import Form, Metric, Question, Response
from wellytics.utils import _map
from wellytics.processing import _jobs, _job_lock

flask_app = Flask(__name__)
CORS(flask_app)


@flask_app.route("/forms", methods=["GET", "POST"])
def forms():
    # TODO: Form might be a dict of a FormSnapshot
    def create_form():
        form = request.get_json()
        form = Form(**form)
        api.create_form(form)
        return jsonify(True)

    # NOTE: Should have `active` as a query param
    # TODO: Add `query` as a query param
    def get_forms():
        query = request.args.get("query", type=str, default="")
        active = request.args.get("active", type=bool, default=True)
        forms = api.get_forms(active=active)
        forms = _map(lambda form: form.dict(), forms)
        return jsonify(forms)

    if request.method == "POST":
        return create_form()
    elif request.method == "GET":
        return get_forms()


@flask_app.route("/forms/<form_id>", methods=["GET", "PATCH", "DELETE"])
def form(form_id: str):
    def get_form():
        form = api.get_form(form_id)
        form = form.dict()
        return jsonify(form)

    def patch_form():
        form = request.get_json()
        api.patch_form(form_id, form)
        return jsonify(True)

    def delete_form():
        api.delete_form(form_id)
        return jsonify(True)

    if request.method == "GET":
        return get_form()
    elif request.method == "PATCH":
        return patch_form()
    elif request.method == "DELETE":
        return delete_form()


@flask_app.route("/forms/<form_id>/metrics", methods=["GET"])
def form_metrics(form_id: str):
    metrics = api.get_form_metrics(form_id)
    metrics = _map(lambda metric: metric.dict(), metrics)
    return jsonify(metrics)


# NOTE: Should accept `force` as a query param
@flask_app.route("/forms/<form_id>/analytics", methods=["GET"])
def form_analytics(form_id: str):
    force = request.args.get("force", type=bool, default=False)
    analytics = api.get_form_analytics(form_id, force=force)
    analytics = analytics.dict()
    return jsonify(analytics)


@flask_app.route("/forms/<form_id>/responses", methods=["GET", "POST"])
def form_responses(form_id: str):
    # TODO: Response might be a dict of a ResponseSnapshot
    def create_response():
        response = request.get_json()
        response = Response(**response)
        api.create_response(response)
        return jsonify(True)

    def get_responses():
        responses = api.get_responses(form_id)
        responses = _map(lambda response: response.dict(), responses)
        return jsonify(responses)

    if request.method == "POST":
        return create_response()
    elif request.method == "GET":
        return get_responses()


@flask_app.route(
    "/forms/<form_id>/responses/<response_id>", methods=["GET", "PATCH", "DELETE"]
)
def form_response(form_id: str, response_id: str):
    def get_response():
        response = api.get_response(form_id, response_id)
        response = response.dict()
        return jsonify(response)

    def patch_response():
        response = request.get_json()
        api.patch_response(form_id, response_id, response)
        return jsonify(True)

    def delete_response():
        api.delete_response(form_id, response_id)
        return jsonify(True)

    if request.method == "GET":
        return get_response()
    elif request.method == "PATCH":
        return patch_response()
    elif request.method == "DELETE":
        return delete_response()


@flask_app.route(
    "/forms/<form_id>/responses/<response_id>/metrics", methods=["GET", "POST"]
)
def form_response_metrics(form_id: str, response_id: str):
    def create_response_metric():
        metric = request.get_json(silent=True)
        if metric is None:
            metric_id = request.args.get("id", type=str)
        else:
            metric = Metric(**metric)
            api.create_metric(metric)
            metric_id = metric.id
        api.add_metric_to_response(form_id, response_id, metric_id)
        return jsonify(True)

    def get_response_metrics():
        metrics = api.get_response_metrics(form_id, response_id)
        metrics = _map(lambda metric: metric.dict(), metrics)
        return jsonify(metrics)

    if request.method == "POST":
        return create_response_metric()
    elif request.method == "GET":
        return get_response_metrics()


@flask_app.route("/forms/<form_id>/responses/<response_id>/analytics", methods=["GET"])
def form_response_analytics(form_id: str, response_id: str):
    analytics = api.get_response_analytics(form_id, response_id)
    analytics = analytics.dict()
    return jsonify(analytics)


# NOTE: Should accept `direction` as a query param
# NOTE: Should accept `amount` as a query param
@flask_app.route("/forms/<form_id>/questions/<question_id>/move", methods=["POST"])
def form_question_move(form_id: str, question_id: str):
    direction = request.args.get("direction", type=str)
    amount = request.args.get("amount", type=int, default=1)

    if direction not in ["up", "down"]:
        raise ValueError(f"Invalid direction: {direction}")

    if direction == "up":
        api.move_question_up(form_id, question_id, amount)
    elif direction == "down":
        api.move_question_down(form_id, question_id, amount)

    return jsonify(True)


@flask_app.route("/questions", methods=["GET", "POST"])
def questions():
    def create_question():
        question = request.get_json(silent=True)
        if question is None:
            question_id = request.args.get("id", type=str)
        else:
            question = Question(**question)
            api.create_question(question)
            question_id = question.id
        api.add_question_to_form(question.form_id, question_id)
        return jsonify(True)

    # TODO: Add `query` as a query param
    def get_questions():
        query = request.args.get("query", type=str, default="")
        questions = api.get_questions()
        questions = _map(lambda question: question.dict(), questions)
        return jsonify(questions)

    if request.method == "POST":
        return create_question()
    elif request.method == "GET":
        return get_questions()


@flask_app.route("/questions/<question_id>", methods=["GET"])
def question(question_id: str):
    question = api.get_question(question_id)
    question = question.dict()
    return jsonify(question)


@flask_app.route("/tracking/<tracking_id>", methods=["GET"])
def tracking(tracking_id: str):
    metrics = api.get_tracking(tracking_id)
    metrics = _map(lambda metric: metric.dict(), metrics)
    return jsonify(metrics)


@flask_app.route("/jobs/<job_id>", methods=["GET"])
def job(job_id: str):
    with _job_lock:
        job = _jobs[job_id]
        status = job.status

    return jsonify(status)


if __name__ == "__main__":
    flask_app.run(threaded=True)
