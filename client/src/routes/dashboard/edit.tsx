import { Button, Input, Select } from 'antd'
import React, { Dispatch, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { LongAnswerQuestion, Question, ShortAnswerQuestion, MultipleChoiceQuestion, CheckboxQuestion, CheckboxGridQuestion } from '../../typings'
import { v4 as uuid } from 'uuid'
import { DropdownQuestion } from '../../typings'
import { LinearScaleQuestion } from '../../typings'
import { MultipleChoiceGridQuestion } from '../../typings'
import { DateQuestion } from '../../typings'
import { TimeQuestion } from '../../typings'
import { NewShortAnswer } from '../../components/NewShortAnswer'
import { NewTime } from '../../components/NewTime'
import { NewDate } from '../../components/NewDate'
import { NewCheckboxGrid } from '../../components/NewCheckboxGrid'
import { NewMultipleChoiceGrid } from '../../components/NewMultipleChoiceGrid'
import { NewLinearScale } from '../../components/NewLinearScale'
import { NewDropdown } from '../../components/NewDropdown'
import { NewCheckbox } from '../../components/NewCheckbox'
import { NewMultipleChoice } from '../../components/NewMultipleChoice'
import { NewLongAnswer } from '../../components/NewLongAnswer'
import { createForm, getForm } from '../../api'
import { useParams } from 'react-router-dom'

export interface Action {
  type: string;
  payload?: any;
}

export interface NewQuestionProps<T = Question> {
  question: T;
  dispatch: Dispatch<Action>;
}

export const questionTypes = [
  "ShortAnswer",
  "LongAnswer",
  "MultipleChoice",
  "Checkbox",
  "Dropdown",
  "LinearScale",
  "MultipleChoiceGrid",
  "CheckboxGrid",
  "Date",
  "Time",
]

export const questionTypeOptions = questionTypes.map((type) => ({ value: type, label: type }))

export const renderQuestion = (question: Question, dispatch: Dispatch<Action>) => {
  switch (question.type) {
    case "ShortAnswer":
      return <NewShortAnswer key={question.id} question={question} dispatch={dispatch} />
    case "LongAnswer":
      return <NewLongAnswer key={question.id} question={question} dispatch={dispatch} />
    case "MultipleChoice":
      return <NewMultipleChoice key={question.id} question={question} dispatch={dispatch} />
    case "Checkbox":
      return <NewCheckbox key={question.id} question={question} dispatch={dispatch} />
    case "Dropdown":
      return <NewDropdown key={question.id} question={question} dispatch={dispatch} />
    case "LinearScale":
      return <NewLinearScale key={question.id} question={question} dispatch={dispatch} />
    case "MultipleChoiceGrid":
      return <NewMultipleChoiceGrid key={question.id} question={question} dispatch={dispatch} />
    case "CheckboxGrid":
      return <NewCheckboxGrid key={question.id} question={question} dispatch={dispatch} />
    case "Date":
      return <NewDate key={question.id} question={question} dispatch={dispatch} />
    case "Time":
      return <NewTime key={question.id} question={question} dispatch={dispatch} />
  }
}

export const resolveEmptyQuestion = (type: string) => {
  switch (type) {
    case "ShortAnswer":
      return {
        id: uuid(),
        type: "ShortAnswer",
        question: "",
        required: false,
      } as ShortAnswerQuestion
    case "LongAnswer":
      return {
        id: uuid(),
        type: "LongAnswer",
        question: "",
        required: false,
      } as LongAnswerQuestion
    case "MultipleChoice":
      return {
        id: uuid(),
        type: "MultipleChoice",
        question: "",
        required: false,
        options: [],
      } as MultipleChoiceQuestion
    case "Checkbox":
      return {
        id: uuid(),
        type: "Checkbox",
        question: "",
        required: false,
        options: [],
      } as CheckboxQuestion
    case "Dropdown":
      return {
        id: uuid(),
        type: "Dropdown",
        question: "",
        required: false,
        options: [],
      } as DropdownQuestion
    case "LinearScale":
      return {
        id: uuid(),
        type: "LinearScale",
        question: "",
        required: false,
        min: 0,
        max: 5,
      } as LinearScaleQuestion
    case "MultipleChoiceGrid":
      return {
        id: uuid(),
        type: "MultipleChoiceGrid",
        questions: [],
        required: false,
        options: [],
      } as MultipleChoiceGridQuestion
    case "CheckboxGrid":
      return {
        id: uuid(),
        type: "CheckboxGrid",
        questions: [],
        required: false,
        options: [],
      } as CheckboxGridQuestion
    case "Date":
      return {
        id: uuid(),
        type: "Date",
        question: "",
        required: false,
      } as DateQuestion
    case "Time":
      return {
        id: uuid(),
        type: "Time",
        question: "",
        required: false,
      } as TimeQuestion
    default:
      return {
        id: uuid(),
        type: "ShortAnswer",
        question: "",
        required: false,
      } as ShortAnswerQuestion
  }
}

export const resolveEmptyOption = () => {
  return {
    id: uuid(),
    label: "",
  }
}

export const resolveEmptySubQuestion = () => {
  return {
    id: uuid(),
    question: "",
  }
}

export const questionsReducer = (questions: Question[], action: Action) => {
  switch (action.type) {
    case "initialize":
      return action.payload
    case "new":
      return [...questions, resolveEmptyQuestion(
        action.payload.type
      )]
    case "update":
      return questions.map((question) =>
        question.id === action.payload.id ? { ...question, ...action.payload.patch }
          : question
      );
    case "newOption":
      return questions.map((question) =>
        question.id === action.payload.id ? {
          ...question,
          // @ts-ignore
          options: [...question.options!, resolveEmptyOption()]
        } : question
      );
    case "updateOption":
      return questions.map((question) =>
        question.id === action.payload.id ? {
          ...question,
          // @ts-ignore
          options: question.options!.map((option) =>
            option.id === action.payload.optionId ? { ...option, ...action.payload.patch } : option
          )
        } : question
      );
    case "newSubQuestion":
      return questions.map((question) =>
        question.id === action.payload.id ? {
          ...question,
          // @ts-ignore
          questions: [...question.questions!, resolveEmptySubQuestion()]
        } : question
      );
    case "updateSubQuestion":
      return questions.map((question) =>
        question.id === action.payload.id ? {
          ...question,
          // @ts-ignore
          questions: question.questions!.map((subQuestion) =>
            subQuestion.id === action.payload.subQuestionId ? { ...subQuestion, ...action.payload.patch } : subQuestion
          )
        } : question
      );
    default:
      return questions;
  }
}

export const DashboardEditForm = () => {
  const { id: _id } = useParams();
  const id = useMemo(() => _id!, [_id])

  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, dispatch] = useReducer(questionsReducer, []);
  const [selectedType, setSelectedType] = useState<string>(questionTypes[0]);

  const initialize = useCallback(async () => {
    const { title, description, questions } = await getForm(id);
    setTitle(title);
    setDescription(description);
    dispatch({ type: "initialize", payload: questions });
    setReady(true);
  }, [setTitle, setDescription, dispatch, id]);

  useEffect(() => { initialize() }, [initialize]);

  const onChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, [setTitle]);

  const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, [setDescription]);

  const onClickSave = useCallback(async () => {
    const form = { id, title, description, questions };
    console.log(await createForm(form));
  }, [id, title, description, questions]);

  return ready ? (
    <div>
      <Input placeholder="Title" value={title} onChange={onChangeTitle} />

      <Input placeholder="Description" value={description} onChange={onChangeDescription} />

      <div>
        {questions.map((question: Question) => renderQuestion(question, dispatch))}
      </div>

      <Select
        value={selectedType}
        onChange={setSelectedType}
        options={questionTypeOptions}
      />

      <Button onClick={() => dispatch({ type: "new", payload: { type: selectedType } })}>
        Add question
      </Button>

      <Button onClick={onClickSave}>
        Save
      </Button>
    </div>
  ) : null
}
