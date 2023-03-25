import { buildUrl } from "build-url-ts"
import { Form, FormAnalytics, FormSnapshot, FormView, Job, JobStatus, Metric, Question, QuestionView, Response, ResponseAnalytics, ResponseSnapshot } from "./typings"
import { sleep } from "./utils";

const DEFAULT_API_URL = 'http://localhost:5000';

export const _loadApiUrl = () =>
    localStorage.getItem('apiUrl') || DEFAULT_API_URL;

export const _saveApiUrl = (apiUrl: string) =>
    localStorage.setItem('apiUrl', apiUrl);


export const createForm = async (form: Form): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: 'forms',
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });

    return await response.json();
}

export const getForms = async (onlyActive?: boolean, query?: string): Promise<FormView[]> => {
    const url = buildUrl(_loadApiUrl(), {
        path: 'forms',
        queryParams: {
            onlyActive: onlyActive !== undefined ? (onlyActive ? "True" : "False") : undefined,
            query,
        }
    });

    const response = await fetch(url);

    return await response.json();
}

export const getForm = async (formId: string): Promise<FormSnapshot> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const patchForm = async (formId: string, form: Partial<FormSnapshot>): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}`,
    });

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });

    return await response.json();
}

export const deleteForm = async (formId: string): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}`,
    });

    const response = await fetch(url, {
        method: 'DELETE',
    });

    return await response.json();
}

export const getFormMetrics = async (formId: string): Promise<Metric[]> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/metrics`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getFormAnalytics = async (formId: string): Promise<FormAnalytics> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/analytics`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const createResponse = async (formId: string, _response: Response): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses`,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(_response),
    });

    return await response.json();
}

export const getResponses = async (formId: string): Promise<ResponseSnapshot[]> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getResponse = async (formId: string, responseId: string): Promise<ResponseSnapshot> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses/${responseId}`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const patchResponse = async (formId: string, responseId: string, _response: Partial<ResponseSnapshot>): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses/${responseId}`,
    });

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(_response),
    });

    return await response.json();
}

export const deleteResponse = async (formId: string, responseId: string): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses/${responseId}`,
    });

    const response = await fetch(url, {
        method: 'DELETE',
    });

    return await response.json();
}

export const createResponseMetric = async (formId: string, responseId: string, metric: Metric): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses/${responseId}/metrics`,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
    });

    return await response.json();
}

export const getResponseMetrics = async (formId: string, responseId: string): Promise<Metric[]> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses/${responseId}/metrics`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getResponseAnalytics = async (formId: string, responseId: string): Promise<ResponseAnalytics> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/responses/${responseId}/analytics`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const moveQuestion = async (formId: string, questionId: string, direction: 'up' | 'down', amount: number = 1): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `forms/${formId}/questions/${questionId}/move`,
        queryParams: {
            direction,
            amount,
        }
    });

    const response = await fetch(url, {
        method: 'POST',
    });

    return await response.json();
}

export const createQuestion = async (question: Question): Promise<void> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `questions`,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
    });

    return await response.json();
}

export const getQuestions = async (query?: string): Promise<QuestionView[]> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `questions`,
        queryParams: {
            query,
        }
    });

    const response = await fetch(url);

    return await response.json();
}

export const getQuestion = async (questionId: string): Promise<Question> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `questions/${questionId}`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getTrackingId = async (trackingId: string): Promise<Metric[]> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `tracking/${trackingId}`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getJob = async (jobId: string): Promise<JobStatus> => {
    const url = buildUrl(_loadApiUrl(), {
        path: `jobs/${jobId}`,
    });

    const response = await fetch(url);

    return await response.json();
}
