export type QuestionType = string;

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

export type Question = ShortAnswerQuestion | LongAnswerQuestion | MultipleChoiceQuestion | CheckboxQuestion | DropdownQuestion | LinearScaleQuestion | MultipleChoiceGridQuestion | CheckboxGridQuestion | DateQuestion | TimeQuestion;

export interface Form {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}