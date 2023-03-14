import { Dispatch } from "react";

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

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    required: boolean;
    question: string;
    placeholder?: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
    type: 'ShortAnswer';
}

export interface LongAnswerQuestion extends BaseQuestion {
    type: 'LongAnswer';
}

export interface Option {
    id: string;
    label: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'MultipleChoice';
    options: Option[];
}

export interface CheckboxQuestion extends BaseQuestion {
    type: 'Checkbox';
    options: Option[];
}

export interface DropdownQuestion extends BaseQuestion {
    type: 'Dropdown';
    options: Option[];
}

export interface LinearScaleQuestion extends BaseQuestion {
    type: 'LinearScale';
    min: number;
    max: number;
}

export interface SubQuestion {
    id: string;
    question: string;
}

export interface MultipleChoiceGridQuestion extends BaseQuestion {
    type: 'MultipleChoiceGrid';
    questions: SubQuestion[];
    options: Option[];
}

export interface CheckboxGridQuestion extends BaseQuestion {
    type: 'CheckboxGrid';
    questions: SubQuestion[];
    options: Option[];
}

export interface DateQuestion extends BaseQuestion {
    type: 'Date';
}

export interface TimeQuestion extends BaseQuestion {
    type: 'Time';
}

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

export interface BaseAnswer {
    id: string;
    type: string;
    questionId: string;
    answer: string;
}

export interface ShortAnswerAnswer extends BaseAnswer {
    type: 'ShortAnswer';
}

export interface LongAnswerAnswer extends BaseAnswer {
    type: 'LongAnswer';
}

export interface MultipleChoiceAnswer extends BaseAnswer {
    type: 'MultipleChoice';
}

export interface CheckboxAnswer extends Omit<BaseAnswer, "answer"> {
    type: 'Checkbox';
    answer: string[];
}

export interface DropdownAnswer extends BaseAnswer {
    type: 'Dropdown';
}

export interface LinearScaleAnswer extends Omit<BaseAnswer, "answer"> {
    type: 'LinearScale';
    answer: number;
}

export interface MultipleChoiceGridAnswer extends Omit<BaseAnswer, "answer"> {
    type: 'MultipleChoiceGrid';
    answer: string[];
}

export interface CheckboxGridAnswer extends Omit<BaseAnswer, "answer"> {
    type: 'CheckboxGrid';
    answer: string[][];
}

export interface DateAnswer extends BaseAnswer {
    type: 'Date';
}

export interface TimeAnswer extends BaseAnswer {
    type: 'Time';
}

export type Answer = ShortAnswerAnswer | LongAnswerAnswer | MultipleChoiceAnswer | CheckboxAnswer | DropdownAnswer | LinearScaleAnswer | MultipleChoiceGridAnswer | CheckboxGridAnswer | DateAnswer | TimeAnswer;

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
    answers: Answer[];
}

export interface Action {
    type: string;
    payload?: any;
}

export interface EditQuestionProps<T = Question> {
    question: T;
    dispatch: Dispatch<Action>;
}

export interface QuestionProps<T = Question, U = Answer> {
    question: T;
    answer: U;
    dispatch: Dispatch<Action>;
}

export interface AnswerProps<T = Question, U = Answer> {
    question: T;
    answers: Answer[];
}

export interface FormView { }

export interface ResponseView { }

export interface FormAnalysis { }

export interface ResponseAnalysis { }

export interface FormAnalysisView { }

export interface ResponseAnalysisView { }
