import { buildUrl } from "build-url-ts"
import { Form } from "./typings"

export interface Job<T = any> {
    id: string;
    status: string;
    error: boolean;
    output?: T;
}

const API_URL = 'http://localhost:5000';

export const createForm = async (form: Form): Promise<boolean> => {
    const url = buildUrl(API_URL, {
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

export const getForms = async (): Promise<Form[]> => {
    const url = buildUrl(API_URL, {
        path: 'forms',
    });

    const response = await fetch(url);

    return await response.json();
}

export const getForm = async (formId: string): Promise<Form> => {
    const url = buildUrl(API_URL, {
        path: `forms/${formId}`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getJob = async (jobId: string) => {
    const url = buildUrl(API_URL, {
        path: `jobs/${jobId}`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const createResponse = async (formId: string, _response: object) => {
    const url = buildUrl(API_URL, {
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

export const getResponses = async (formId: string) => {
    const url = buildUrl(API_URL, {
        path: `forms/${formId}/responses`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getKeywords = async (formId: string) => {
    const url = buildUrl(API_URL, {
        path: `forms/${formId}/responses/keywords`,
    });

    const response = await fetch(url);

    return await response.json();
}

export const getEmotions = async (formId: string) => { }

export const getSummary = async (formId: string) => { }

export const getResponse = async (formId: string, responseId: string) => { }

export const getResponseKeywords = async (formId: string, responseId: string) => { }

export const getResponseEmotions = async (formId: string, responseId: string) => { }

export const getResponseSummary = async (formId: string, responseId: string) => { }

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export const joinJob = async <T,>(
    jobId: string,
    onProgressCallback: Function,
    timeout: number = 250
): Promise<Job<T>> => {
    let job = await getJob(jobId);

    while (job.status === 'running') {
        onProgressCallback(job);
        await sleep(timeout);
        job = await getJob(jobId);
    }

    return job;
}
