# Welcome to Wellytics

Wellytics `work-in-progress` is a natural language processing (NLP) platform designed to analyze survey responses using machine learning algorithms. Our platform offers three key features: emotion analysis, keyword extraction, and metrics regressions. With Wellytics, you can quickly and easily analyze your survey responses to gain valuable insights into target audience.

This project was originally made as a Minerva University Cornerstone Civic Project (CCP) for the non-profit organization Brothers on The Rise as mechanism to quantify the impact their community activities has.

## Emotion Analysis

Wellytics uses machine learning algorithms to perform emotion analysis on survey responses. Our platform analyzes text data to identify the emotions expressed in each response and provides an emotion score for each response. With this feature, you can quickly determine the overall sentiment of your survey responses, identify key emotions expressed by respondents, and anonymously track changes in sentiment over time.

Our solution can detect and measure the following emotions:

```python
emotions = [
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
```

## Keyword Extraction

Wellytics also provides keyword extraction, which identifies the most important topics or keywords mentioned in survey responses. Our platform uses machine learning algorithms to identify the most frequently mentioned words or phrases in your survey responses, enabling you to quickly identify key themes or issues that are important to your respondents.

## Metrics Regressions

Wellytics provides metrics regressions to help you analyze the relationship between survey responses and key metrics. Our platform uses machine learning algorithms to identify the relationship between survey responses and metrics.

The challenge question for the CCP collaboration is:

> How can data analytics and descriptive statistics be applied to provide actionable information via a data-collecting digital platform to improve educational experiences for boys of color residing in Oakland?

## Getting Started

To get started with Wellytics, simply upload your survey responses to our platform. Our machine learning algorithms will analyze your data and provide you with a detailed report that includes emotion analysis, keyword extraction, and metrics regressions. Our platform is easy to use, and our intuitive interface makes it simple to navigate and understand your survey data.

## Database structure

```plain
forms
    [formId]
        id: string
        createdAt: number
        updatedAt: number
        
        active: boolean
        
        title: string
        description: string
        
        questions: ref[formQuestions/[questionId]][]

questions
    [questionId]
        id: string
        type: string
        required: boolean
        question: string
        placeholder: string
        options: ({
            id: string
            label: string
        })[]
        min: number
        max: number
        questions: ({
            id: string
            question: string
        })[]

# Responses
[formId]
    [responseId] 
        id: string
        createdAt: number
        updatedAt: number

        formId: string
        trackingId: string

        response
            [id]: string | map[string, string]

        metrics: 
            ref[responseMetrics/[responseId]][]
        
metrics
    [responseId]
        id: string
        createdAt: number
        updatedAt: number

        trackingId: string

        [metric]: number

formAnalyses # Collection
    [formId] # Document
        id: string
        createdAt: number
        updatedAt: number
        
        (...)

responseAnalyses # Collection
    [responseId] # Document
        id: string
        createdAt: number
        updatedAt: number
        
        formId: string

        (...)
```

## API

```md

## `GET /forms/`
Should return forms view

## ``POST /forms/``

## `GET /forms/:formId`
Should return full form

## `PATCH /forms/:formId`

## `DELETE /forms/:formId`

## `GET /forms/:formId/responses`
Should return full responses

## `POST /forms/:formId/responses`

## `GET /forms/:formId/responses/metrics`
Should return full metrics

## `GET /forms/:formId/responses/analysis`
Should return job id. 
Starts computing the analysis for all the responses

## `GET /forms/:formId/responses/:responseId`
Should return job id.
Starts computing the analysis for the given response

## `PATCH /forms/:formId/responses/:responseId`

## `DELETE /forms/:formId/responses/:responseId`
Should return job id.
Starts computing the analysis for the given response

## `GET /forms/:formId/responses/:responseId/metrics`
Should return full metrics for this particular response

## `GET /forms/:formId/responses/:responseId/analysis`
Should return the job id.
Starts computing the analysis for the given response.

## `GET /metrics/`

## `GET /metrics/:metricId`

## `GET /tracking/:trackingId`

## `GET /jobs/:jobId`
```
