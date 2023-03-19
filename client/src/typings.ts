import { Dispatch } from "react";

export enum JobStatus {
    Pending = 'Pending',
    Processing = 'Processing',
    Error = 'Error',
    Finished = 'Finished',
}

export enum JobType {
    FormAnalytics = 'FormAnalytics',
    ResponseAnalytics = 'ResponseAnalytics',
}

export interface Job<T = any> {
    id: string;
    type: JobType;
    status: JobStatus;
    payload: any;
    result: T;
    // callback
}

export enum QuestionType {
    ShortAnswer = 'ShortAnswer',
    LongAnswer = 'LongAnswer',
    MultipleChoice = 'MultipleChoice',
    Checkbox = 'Checkbox',
    Dropdown = 'Dropdown',
    LinearScale = 'LinearScale',
    MultipleChoiceGrid = 'MultipleChoiceGrid',
    CheckboxGrid = 'CheckboxGrid',
    Date = 'Date',
    Time = 'Time'
}

export interface Option {
    id: string;
    label: string;
}


export interface SubQuestion {
    id: string;
    question: string;
}

export interface Question {
    id: string;
    createdAt: number;
    updatedAt: number;
    type: QuestionType;
    required: boolean;
    question: string;
    placeholder?: string;
    subQuestions?: Array<SubQuestion>
    options?: Array<Record<string, string>>
    min?: number;
    max?: number;
}

export interface QuestionView {
    id: string;
    createdAt: number;
    updatedAt: number;
    type: QuestionType;
    question: string;
}

export interface Form {
    id: string;
    createdAt: number;
    updatedAt: number;
    active: boolean;
    title: string;
    description: string;
    questions: Array<string>;
}

export interface FormSnapshot extends Omit<Form, "questions"> {
    questions: Array<Question>;
}

export interface FormView {
    id: string;
    createdAt: number;
    updatedAt: number;
    active: boolean;
    title: string;
    description: string;
}

export interface Metric {
    id: string;
    createdAt: number;
    updatedAt: number;
    trackingId: string;
    values: Record<string, number>;
}

export type Answer = string | Record<string, string>

export type Answers = Record<string, Answer>

export interface Response {
    id: string;
    createdAt: number;
    updatedAt: number;
    formId: string;
    trackingId: string;
    answers: Answers;
    metrics: Array<string>;
}

export interface ResponseSnapshot extends Omit<Response, "metrics"> {
    metrics: Array<Metric>;
}

export interface Emotion {
    label: string;
    score: number;
}

export interface Keyword {
    label: string;
    score: number;
}

export interface ResponseAnalytics {
    id: string;
    createdAt: number;
    updatedAt: number;
    status: JobStatus;
    jobId: string;
    formId: string;
    trackingId: string;
    keywords?: Record<string, Array<Keyword>>;
    emotions?: Record<string, Array<Emotion>>;
}

export interface FormAnalytics {
    id: string;
    createdAt: number;
    updatedAt: number;
    status: JobStatus;
    jobId: string;
    formId: string;
    keywords?: Record<string, Array<Keyword>>;
    emotions?: Record<string, Array<Emotion>>;
    responseAnalytics?: Array<ResponseAnalytics>;
}

export interface ShortAnswerQuestion extends Question {
    type: QuestionType.ShortAnswer;
}


export interface LongAnswerQuestion extends Question {
    type: QuestionType.LongAnswer;
}


export interface MultipleChoiceQuestion extends Omit<Question, "options"> {
    type: QuestionType.MultipleChoice;
    options: Option[];
}

export interface CheckboxQuestion extends Omit<Question, "options"> {
    type: QuestionType.Checkbox;
    options: Option[];
}

export interface DropdownQuestion extends Omit<Question, "options"> {
    type: QuestionType.Dropdown;
    options: Option[];
}

export interface LinearScaleQuestion extends Omit<Question, "min" | "max"> {
    type: QuestionType.LinearScale;
    min: number;
    max: number;
}


export interface MultipleChoiceGridQuestion extends Omit<Question, "subQuestions" | "options"> {
    type: QuestionType.MultipleChoiceGrid;
    subQuestions: SubQuestion[];
    options: Option[];
}


export interface CheckboxGridQuestion extends Omit<Question, "subQuestions" | "options"> {
    type: QuestionType.CheckboxGrid;
    subQuestions: SubQuestion[];
    options: Option[];
}

export interface DateQuestion extends Question {
    type: QuestionType.Date;
}


export interface TimeQuestion extends Question {
    type: QuestionType.Time;
}

export interface Action {
    type: string;
    payload?: any;
}

export interface EditQuestionProps<T = Question> {
    question: T;
    dispatch: Dispatch<Action>;
}

export interface QuestionProps<T = Question> {
    question: T;
    dispatch: Dispatch<Action>;
}

export interface AnswerProps<T = Question, U = any> {
    question: T;
    answers: U[];
}
