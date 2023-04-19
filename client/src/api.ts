// import { buildUrl } from "build-url-ts"
import { Form, FormAnalytics, FormSnapshot, FormView, JobStatus, Metric, Question, QuestionView, Response, ResponseAnalytics, ResponseSnapshot } from "./typings"
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDoc, doc, setDoc, updateDoc, deleteDoc, getDocs, where, query, arrayUnion
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDEHoDI6LnDqR3hnu3GU0m_exVA4fFRPLc",
    authDomain: "wellytics-114f3.firebaseapp.com",
    projectId: "wellytics-114f3",
    storageBucket: "wellytics-114f3.appspot.com",
    messagingSenderId: "519169968820",
    appId: "1:519169968820:web:4a43a28d634581cf3ae5e1",
    measurementId: "G-1VKFWHVH1N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const DEFAULT_API_URL = 'http://localhost:5000';

// export const _loadApiUrl = () =>
//     localStorage.getItem('apiUrl') || DEFAULT_API_URL;

// export const _saveApiUrl = (apiUrl: string) =>
//     localStorage.setItem('apiUrl', apiUrl);


export const createForm = async (form: Form): Promise<void> => {
    const formRef = doc(db, "forms", form.id);
    const questionRefs = form.questions.map((questionId) => doc(db, "questions", questionId));
    const formDict = {
        ...form,
        questions: questionRefs,
    };
    await setDoc(formRef, formDict);
}

export const getForms = async (onlyActive?: boolean): Promise<FormView[]> => {
    const formsCollectionRef = collection(db, "forms");
    let querySnapshot;
    if (onlyActive) {
        querySnapshot = await getDocs(query(formsCollectionRef, where("active", "==", true)));
    }
    else {
        querySnapshot = await getDocs(formsCollectionRef);
    }
    const formViewDicts = querySnapshot.docs.map((doc) => doc.data());
    return formViewDicts as FormView[];
}

export const getForm = async (formId: string): Promise<FormSnapshot> => {
    const formRef = doc(db, "forms", formId);
    const formDoc = await getDoc(formRef);
    const formDict = formDoc.data();
    if (!formDict) throw new Error("Form not found");

    const questionRefs = formDict.questions;
    const questionDocs = await Promise.all(questionRefs.map((questionRef: any) => getDoc(questionRef)));
    const questionDicts = questionDocs.map((questionDoc) => questionDoc.data());

    return {
        ...formDict,
        questions: questionDicts,
    } as FormSnapshot;
}

export const patchForm = async (formId: string, form: Partial<FormSnapshot>): Promise<void> => {
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, form);
}

export const deleteForm = async (formId: string): Promise<void> => {
    const formRef = doc(db, "forms", formId);
    await deleteDoc(formRef);
}

export const getFormMetrics = async (formId: string): Promise<Metric[]> => {
    const formRef = doc(db, "forms", formId);
    const formDoc = await getDoc(formRef);
    const formDict = formDoc.data();
    if (!formDict) return [];
    const questionRefs = formDict.questions;
    const questionDocs = await Promise.all(questionRefs.map((questionRef: any) => getDoc(questionRef)));
    const questionDicts = questionDocs.map((questionDoc) => questionDoc.data());
    const metricDicts = questionDicts.flatMap((questionDict) => questionDict.metrics);
    return metricDicts as Metric[];
}

export const getFormAnalytics = async (formId: string): Promise<FormAnalytics> => {
    throw new Error("Not implemented");
}

export const createResponse = async (formId: string, _response: Response): Promise<void> => {
    const responseRef = doc(db, formId, _response.id);
    const metricRefs = _response.metrics.map((metricId) => doc(db, "metrics", metricId));
    const responseDict = {
        ..._response,
        metrics: metricRefs,
    };
    await setDoc(responseRef, responseDict);
}

export const getResponses = async (formId: string): Promise<ResponseSnapshot[]> => {
    const responsesCollectionRef = collection(db, formId);
    const querySnapshot = await getDocs(responsesCollectionRef);
    const responseDicts = querySnapshot.docs.map((doc) => doc.data());
    return responseDicts as ResponseSnapshot[];
}

export const getResponse = async (formId: string, responseId: string): Promise<ResponseSnapshot> => {
    const responseRef = doc(db, formId, responseId);
    const responseDoc = await getDoc(responseRef);
    const responseDict = responseDoc.data();
    return responseDict as ResponseSnapshot;
}

export const patchResponse = async (formId: string, responseId: string, _response: Partial<ResponseSnapshot>): Promise<void> => {
    const responseRef = doc(db, formId, responseId);
    await updateDoc(responseRef, _response);
}

export const deleteResponse = async (formId: string, responseId: string): Promise<void> => {
    const responseRef = doc(db, formId, responseId);
    await deleteDoc(responseRef);
}

export const createResponseMetric = async (formId: string, responseId: string, metric: Metric): Promise<void> => {
    const metricRef = doc(db, "metrics", metric.id);
    await setDoc(metricRef, metric);
    const responseRef = doc(db, formId, responseId);
    await updateDoc(responseRef, {
        metrics: arrayUnion(metricRef),
    });
}

export const getResponseMetrics = async (formId: string, responseId: string): Promise<Metric[]> => {
    const responseRef = doc(db, formId, responseId);
    const responseDoc = await getDoc(responseRef);
    const responseDict = responseDoc.data();
    if (!responseDict) return [];
    const metricRefs = responseDict.metrics;
    const metricDocs = await Promise.all(metricRefs.map((metricRef: any) => getDoc(metricRef)));
    const metricDicts = metricDocs.map((metricDoc) => metricDoc.data());
    return metricDicts as Metric[];
}

export const getResponseAnalytics = async (formId: string, responseId: string): Promise<ResponseAnalytics> => {
    throw new Error("Not implemented");
}

export const moveQuestion = async (formId: string, questionId: string, direction: 'up' | 'down', amount: number = 1): Promise<void> => {
    throw new Error("Not implemented");
}

export const createQuestion = async (question: Question): Promise<void> => {
    const questionRef = doc(db, "questions", question.id);
    await setDoc(questionRef, question);
}

export const getQuestions = async (): Promise<QuestionView[]> => {
    const questionsCollectionRef = collection(db, "questions");
    const querySnapshot = await getDocs(questionsCollectionRef);
    const questionDicts = querySnapshot.docs.map((doc) => doc.data());
    return questionDicts as QuestionView[];
}

export const getQuestion = async (questionId: string): Promise<Question> => {
    const questionRef = doc(db, "questions", questionId);
    const questionDoc = await getDoc(questionRef);
    const questionDict = questionDoc.data();
    return questionDict as Question;
}

export const getTrackingId = async (trackingId: string): Promise<Metric[]> => {
    const metricsCollectionRef = collection(db, "metrics");
    const querySnapshot = await getDocs(
        query(metricsCollectionRef, where("trackingId", "==", trackingId))
    );
    const metricDicts = querySnapshot.docs.map((doc) => doc.data());
    return metricDicts as Metric[];
}

export const getJob = async (jobId: string): Promise<JobStatus> => {
    throw new Error("Not implemented");
}
