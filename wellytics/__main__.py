import json
import threading

from queue import Queue
from collections import OrderedDict
from typing import Dict
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

# KEYWORDS_THRESHOLD = 0.7
# EMOTIONS_THRESHOLD = 0.7

# _KEYWORDS_MODEL = "yanekyuk/bert-uncased-keyword-extractor"
# _EMOTIONS_MODEL = "joeddav/distilbert-base-uncased-go-emotions-student"

# _keywords_pipeline = pipeline("ner", model=_KEYWORDS_MODEL)

# _emotions_pipeline = pipeline(
#     "text-classification",
#     model=_EMOTIONS_MODEL,
#     return_all_scores=True,
# )
# def _get_keywords(text: str):
#     outputs = _keywords_pipeline(text)
#     outputs = sorted(outputs, key=lambda x: x["start"])

#     _outputs = []
#     for output in outputs:
#         if len(_outputs) == 0:
#             _outputs.append(output)
#         else:
#             last_merged_output = _outputs[-1]
#             if output["start"] == last_merged_output["end"]:
#                 x = last_merged_output["word"].replace("#", "")
#                 y = output["word"].replace("#", "")
#                 last_merged_output["word"] = x + y
#                 last_merged_output["end"] = output["end"]
#             else:
#                 _outputs.append(output)

#     outputs = sorted(_outputs, reverse=True, key=lambda x: x["score"])

#     return outputs


# def _get_emotions(text: str):
#     outputs = _emotions_pipeline(text)[0]
#     outputs = sorted(outputs, reverse=True, key=lambda x: x["score"])

#     return outputs


# @app.route("/keywords", methods=["POST"])
# def keywords():
#     return jsonify(_get_keywords(request.json["text"]))


# @app.route("/emotions", methods=["POST"])
# def emotions():
#     return jsonify(_get_emotions(request.json["text"]))


_jobs: Dict[str, OrderedDict[str, "Job"]] = {}
_job_lock = threading.Lock()


class Job(BaseModel):
    id: str
    status: str
    result: str


@flask_app.route("/forms", methods=["GET", "POST"])
def create_or_get_forms():
    def create_form():
        form = request.get_json()
        firestore.collection("forms").document(form["id"]).set(form)
        return jsonify(True)

    def get_forms():
        forms_ref = firestore.collection("forms")
        forms = forms_ref.stream()
        forms = [form.to_dict() for form in forms]
        return jsonify(forms)

    return create_form() if request.method == "POST" else get_forms()


@flask_app.route("/forms/<form_id>", methods=["GET"])
def get_form(form_id: str):
    form_ref = firestore.collection("forms").document(form_id)
    form = form_ref.get().to_dict()
    return jsonify(form)


@flask_app.route("/forms/<form_id>/jobs", methods=["GET"])
def get_jobs(form_id: str):
    pass


@flask_app.route("/forms/<form_id>/jobs/<job_id>", methods=["GET"])
def get_job(form_id: str, job_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses", methods=["GET", "POST"])
def create_or_get_responses(form_id: str):
    def create_response():
        response = request.get_json()
        response["answers"] = json.dumps(response["answers"])
        firestore.collection(form_id).document(response["id"]).set(response)
        return jsonify(True)

    def get_responses():
        responses_ref = firestore.collection(form_id)
        responses = responses_ref.stream()
        responses = [response.to_dict() for response in responses]
        for response in responses:
            response["answers"] = json.loads(response["answers"])
        return jsonify(responses)

    return create_response() if request.method == "POST" else get_responses()


@flask_app.route("/forms/<form_id>/responses/keywords", methods=["GET"])
def get_keywords(form_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/emotions", methods=["GET"])
def get_emotions(form_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/summary", methods=["GET"])
def get_summary(form_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>", methods=["GET"])
def get_response(form_id: str, response_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>/keywords", methods=["GET"])
def get_response_keywords(form_id: str, response_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>/emotions", methods=["GET"])
def get_response_emotions(form_id: str, response_id: str):
    pass


@flask_app.route("/forms/<form_id>/responses/<response_id>/summary", methods=["GET"])
def get_response_summary(form_id: str, response_id: str):
    pass


if __name__ == "__main__":
    flask_app.run(threaded=True)
