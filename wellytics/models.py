from typing import Dict, List, Optional, Union
from pydantic import BaseModel

ResponseAnalyticsCollection = "responseAnalyses"
FormAnalyticsCollection = "formAnalyses"


class JobStatus:
    Pending = "Pending"
    Processing = "Processing"
    Error = "Error"
    Finished = "Finished"


class JobType:
    FormAnalytics = "FormAnalytics"
    ResponseAnalytics = "ResponseAnalytics"


class Question(BaseModel):
    id: str
    createdAt: int
    updatedAt: int
    type: str
    required: bool
    question: str
    placeholder: Optional[str]
    subQuestions: Optional[List[Dict[str, str]]]
    options: Optional[List[Dict[str, str]]]
    min: Optional[int]
    max: Optional[int]


class QuestionView(BaseModel):
    id: str
    createdAt: int
    updatedAt: int
    type: str
    question: str


class Form(BaseModel):
    id: str
    createdAt: int
    updatedAt: int
    active: bool
    title: str
    description: str
    questions: List[str]  # ref to question


class FormSnapshot(Form):
    questions: List[Question]


class FormView(BaseModel):
    id: str
    createdAt: int
    updatedAt: int
    active: bool
    title: str
    description: str


class Metric(BaseModel):
    id: str
    createdAt: int
    updatedAt: int
    trackingId: str
    values: Dict[str, float]


class Response(BaseModel):
    id: str
    createdAt: int
    updatedAt: int
    formId: str
    trackingId: str
    answers: Dict[str, Union[str, Dict[str, str]]]
    metrics: List[str]  # ref to metric


class ResponseSnapshot(Response):
    metrics: List[Metric]


class Emotion(BaseModel):
    label: str
    score: float


class Keyword(BaseModel):
    label: str
    score: float


class ResponseAnalytics(BaseModel):
    id: str
    createdAt: int
    updatedAt: int

    status: str
    jobId: str

    formId: str
    trackingId: str
    keywords: Optional[Dict[str, List[Keyword]]]
    emotions: Optional[Dict[str, List[Emotion]]]


class FormAnalytics(BaseModel):
    id: str
    createdAt: int
    updatedAt: int

    status: str
    jobId: str

    formId: str
    keywords: Optional[Dict[str, List[Keyword]]]
    emotions: Optional[Dict[str, List[Emotion]]]
    responseAnalytics: Optional[List[ResponseAnalytics]]
