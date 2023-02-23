import { buildUrl } from "build-url-ts"
import { Form } from "./typings"

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

export const getJobs = async (formId: string) => { }

export const getJob = async (formId: string, jobId: string) => { }

export const createResponse = async (formId: string, response: object) => { }

export const getResponses = async (formId: string) => { }

export const getKeywords = async (formId: string) => { }

export const getEmotions = async (formId: string) => { }

export const getSummary = async (formId: string) => { }

export const getResponse = async (formId: string, responseId: string) => { }

export const getResponseKeywords = async (formId: string, responseId: string) => { }

export const getResponseEmotions = async (formId: string, responseId: string) => { }

export const getResponseSummary = async (formId: string, responseId: string) => { }