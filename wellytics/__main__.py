import os

import wellytics.api as api

from flask import Flask, request, jsonify

from flask_cors import CORS

from wellytics.processing import _jobs, _job_lock

flask_app = Flask(__name__)
CORS(flask_app)


# NOTE: Should accept `force` as a query param
@flask_app.route("/forms/<form_id>/analytics", methods=["GET"])
def form_analytics(form_id: str):
    force = request.args.get("force", type=bool, default=False)
    analytics = api.get_form_analytics(form_id, force=force)
    analytics = analytics.dict()
    return jsonify(analytics)


@flask_app.route("/forms/<form_id>/responses/<response_id>/analytics", methods=["GET"])
def form_response_analytics(form_id: str, response_id: str):
    analytics = api.get_response_analytics(form_id, response_id)
    analytics = analytics.dict()
    return jsonify(analytics)


@flask_app.route("/jobs/<job_id>", methods=["GET"])
def job(job_id: str):
    with _job_lock:
        job = _jobs[job_id]
        status = job.status

    return jsonify(status)


@flask_app.route("/ping", methods=["GET"])
def ping():
    return jsonify("pong")


if __name__ == "__main__":
    flask_app.run(
        debug=False,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
    )
