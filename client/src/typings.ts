import { Dispatch } from "react";

export interface BaseQuestion {
    id: string;
    type: string;
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

export interface MultipleChoiceGridQuestion extends Omit<BaseQuestion, "question"> {
    type: 'MultipleChoiceGrid';
    questions: SubQuestion[];
    options: Option[];
}

export interface CheckboxGridQuestion extends Omit<BaseQuestion, "question"> {
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

export interface Form {
    id: string;
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

export interface CheckboxAnswer extends BaseAnswer {
    type: 'Checkbox';
}

export interface DropdownAnswer extends BaseAnswer {
    type: 'Dropdown';
}

export interface LinearScaleAnswer extends BaseAnswer {
    type: 'LinearScale';
}

export interface MultipleChoiceGridAnswer extends BaseAnswer {
    type: 'MultipleChoiceGrid';
}

export interface CheckboxGridAnswer extends BaseAnswer {
    type: 'CheckboxGrid';
}

export interface DateAnswer extends BaseAnswer {
    type: 'Date';
}

export interface TimeAnswer extends BaseAnswer {
    type: 'Time';
}

export type Answer = ShortAnswerAnswer | LongAnswerAnswer | MultipleChoiceAnswer | CheckboxAnswer | DropdownAnswer | LinearScaleAnswer | MultipleChoiceGridAnswer | CheckboxGridAnswer | DateAnswer | TimeAnswer;

export interface Response {
    id: string;
    formId: string;
    trackingId: string;
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

export interface QuestionProps<T = Question> {
    question: T;
    dispatch: Dispatch<Action>;
}
