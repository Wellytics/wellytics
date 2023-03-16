import { Dispatch } from "react";
import { EditCheckbox } from "./components/edit/EditCheckbox";
import { EditCheckboxGrid } from "./components/edit/EditCheckboxGrid";
import { EditDate } from "./components/edit/EditDate";
import { EditDropdown } from "./components/edit/EditDropdown";
import { EditLinearScale } from "./components/edit/EditLinearScale";
import { EditLongAnswer } from "./components/edit/EditLongAnswer";
import { EditMultipleChoice } from "./components/edit/EditMultipleChoice";
import { EditMultipleChoiceGrid } from "./components/edit/EditMultipleChoiceGrid";
import { EditShortAnswer } from "./components/edit/EditShortAnswer";
import { EditTime } from "./components/edit/EditTime";
import { QuestionType, EditQuestionProps, Question, Action, Answer, AnswerProps, QuestionProps, Form } from "./typings";
import { AnswerCheckbox } from "./components/answers/AnswerCheckbox";
import { AnswerCheckboxGrid } from "./components/answers/AnswerCheckboxGrid";
import { AnswerDate } from "./components/answers/AnswerDate";
import { AnswerDropdown } from "./components/answers/AnswerDropdown";
import { AnswerLinearScale } from "./components/answers/AnswerLinearScale";
import { AnswerLongAnswer } from "./components/answers/AnswerLongAnswer";
import { AnswerMultipleChoice } from "./components/answers/AnswerMultipleChoice";
import { AnswerMultipleChoiceGrid } from "./components/answers/AnswerMultipleChoiceGrid";
import { AnswerShortAnswer } from "./components/answers/AnswerShortAnswer";
import { AnswerTime } from "./components/answers/AnswerTime";
import { QuestionCheckbox } from "./components/questions/QuestionCheckbox";
import { QuestionCheckboxGrid } from "./components/questions/QuestionCheckboxGrid";
import { QuestionDate } from "./components/questions/QuestionDate";
import { QuestionDropdown } from "./components/questions/QuestionDropdown";
import { QuestionLinearScale } from "./components/questions/QuestionLinearScale";
import { QuestionLongAnswer } from "./components/questions/QuestionLongAnswer";
import { QuestionMultipleChoice } from "./components/questions/QuestionMultipleChoice";
import { QuestionMultipleChoiceGrid } from "./components/questions/QuestionMultipleChoiceGrid";
import { QuestionShortAnswer } from "./components/questions/QuestionShortAnswer";
import { QuestionTime } from "./components/questions/QuestionTime";
import { v4 as uuid } from 'uuid';

export const typeToEdit: Record<QuestionType, React.FC<EditQuestionProps<any>>> = {
    ShortAnswer: EditShortAnswer,
    LongAnswer: EditLongAnswer,
    MultipleChoice: EditMultipleChoice,
    Checkbox: EditCheckbox,
    Dropdown: EditDropdown,
    LinearScale: EditLinearScale,
    MultipleChoiceGrid: EditMultipleChoiceGrid,
    CheckboxGrid: EditCheckboxGrid,
    Date: EditDate,
    Time: EditTime,
}

export const typeToAnswer: Record<QuestionType, React.FC<AnswerProps<any>>> = {
    "ShortAnswer": AnswerShortAnswer,
    "LongAnswer": AnswerLongAnswer,
    "MultipleChoice": AnswerMultipleChoice,
    "Checkbox": AnswerCheckbox,
    "Dropdown": AnswerDropdown,
    "LinearScale": AnswerLinearScale,
    "MultipleChoiceGrid": AnswerMultipleChoiceGrid,
    "CheckboxGrid": AnswerCheckboxGrid,
    "Date": AnswerDate,
    "Time": AnswerTime,
}

export const typeToQuestion: Record<QuestionType, React.FC<QuestionProps<any, any>>> = {
    ShortAnswer: QuestionShortAnswer,
    LongAnswer: QuestionLongAnswer,
    MultipleChoice: QuestionMultipleChoice,
    Checkbox: QuestionCheckbox,
    Dropdown: QuestionDropdown,
    LinearScale: QuestionLinearScale,
    CheckboxGrid: QuestionCheckboxGrid,
    Date: QuestionDate,
    Time: QuestionTime,
    MultipleChoiceGrid: QuestionMultipleChoiceGrid,
}

export const renderEditQuestion = (question: Question, dispatch: Dispatch<Action>) => {
    const props = {
        key: question.id,
        question,
        dispatch,
    } as EditQuestionProps<any>;

    const Component = typeToEdit[question.type];

    return <Component {...props} />
}


export const renderAnswerQuestion = (question: Question, answers: Answer[]) => {
    const props = {
        key: question.id,
        question,
        answers,
    }

    const Component = typeToAnswer[question.type];

    return <Component {...props} />
}


export const renderQuestion = (question: Question, answer: Answer, dispatch: Dispatch<Action>) => {
    const props = {
        key: question.id,
        question,
        answer,
        dispatch,
    } as QuestionProps<any, any>

    const Component = typeToQuestion[question.type]

    return <Component {...props} />
}

export const resolveEmptyForm = () => {
    return {
        id: uuid(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        title: '',
        description: '',
        questions: [],
    } as Form
}


export const resolveEmptyAnswer = (question: Question) => {
    switch (question.type) {
        case "ShortAnswer":
            return {
                id: uuid(),
                type: "ShortAnswer",
                questionId: question.id,
                answer: "",
            }
        case "LongAnswer":
            return {
                id: uuid(),
                type: "LongAnswer",
                questionId: question.id,
                answer: "",
            }
        case "MultipleChoice":
            return {
                id: uuid(),
                type: "MultipleChoice",
                questionId: question.id,
                answer: "",
            }
        case "Checkbox":
            return {
                id: uuid(),
                type: "Checkbox",
                questionId: question.id,
                answer: [],
            }
        case "Dropdown":
            return {
                id: uuid(),
                type: "Dropdown",
                questionId: question.id,
                answer: "",
            }
        case "LinearScale":
            return {
                id: uuid(),
                type: "LinearScale",
                questionId: question.id,
                answer: question.min,
            }
        case "MultipleChoiceGrid":
            return {
                id: uuid(),
                type: "MultipleChoiceGrid",
                questionId: question.id,
                answer: question.subQuestions.map(() => ""),
            }
        case "CheckboxGrid":
            return {
                id: uuid(),
                type: "CheckboxGrid",
                questionId: question.id,
                answer: question.subQuestions.map(() => []),
            }
        case "Date":
            return {
                id: uuid(),
                type: "Date",
                questionId: question.id,
                answer: "",
            }
        case "Time":
            return {
                id: uuid(),
                type: "Time",
                questionId: question.id,
                answer: "",
            }
    }
}
