# wellytics

## Firestore

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
