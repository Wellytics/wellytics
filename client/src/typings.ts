import { Dispatch } from "react";

export interface Option {
    id: string;
    label: string;
}

export type QuestionType =
    'ShortAnswer'
    | 'LongAnswer'
    | 'MultipleChoice'
    | 'Checkbox'
    | 'Dropdown'
    | 'LinearScale'
    | 'MultipleChoiceGrid'
    | 'CheckboxGrid'
    | 'Date'
    | 'Time';

export interface BaseQuestion<T extends QuestionType> {
    id: string;
    type: T;
    required: boolean;
    question: string;
    placeholder?: string;
}

export interface SubQuestion {
    id: string;
    question: string;
}

export type ShortAnswerQuestion = BaseQuestion<'ShortAnswer'>;

export type LongAnswerQuestion = BaseQuestion<'LongAnswer'>;

export type MultipleChoiceQuestion = BaseQuestion<'MultipleChoice'> & { options: Option[] };

export type CheckboxQuestion = BaseQuestion<'Checkbox'> & { options: Option[] };

export type DropdownQuestion = BaseQuestion<'Dropdown'> & { options: Option[] };

export type LinearScaleQuestion = BaseQuestion<'LinearScale'> & {
    min: number;
    max: number;
}

export type MultipleChoiceGridQuestion = BaseQuestion<'MultipleChoiceGrid'> & {
    subQuestions: SubQuestion[];
    options: Option[];
}

export type CheckboxGridQuestion = BaseQuestion<'CheckboxGrid'> & {
    subQuestions: SubQuestion[];
    options: Option[];
}

export type DateQuestion = BaseQuestion<'Date'>;

export type TimeQuestion = BaseQuestion<'Time'>;

export type Question =
    ShortAnswerQuestion
    | LongAnswerQuestion
    | MultipleChoiceQuestion
    | CheckboxQuestion
    | DropdownQuestion
    | LinearScaleQuestion
    | MultipleChoiceGridQuestion
    | CheckboxGridQuestion
    | DateQuestion
    | TimeQuestion;

export interface Id {
    id: string;
    createdAt: number;
    updatedAt: number;
}

export interface Form extends Id {
    title: string;
    description: string;
    questions: Question[];
}

export interface MetricDefinition extends Id {
    name: string;
    description: string;
}

export interface Metric extends Id {
    value?: number;
}

export interface Response extends Id {
    formId: string;
    trackingId: string;
    metrics: Metric[];
    answers: Record<string, string | Record<string, string>>;
}

export interface Action {
    type: string;
    payload?: any;
}

export interface EditQuestionProps<T = Question> {
    question: T;
    dispatch: Dispatch<Action>;
}

export interface QuestionProps<T = Question, U = any> {
    question: T;
    answer: U;
    dispatch: Dispatch<Action>;
}

export interface AnswerProps<T = Question, U = any> {
    question: T;
    answers: U[];
}

export interface FormView { }

export interface ResponseView { }

export interface FormAnalysis { }

export interface ResponseAnalysis { }

export interface FormAnalysisView { }

export interface ResponseAnalysisView { }
