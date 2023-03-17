import { Button, Input, Select } from 'antd'
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { LongAnswerQuestion, Question, ShortAnswerQuestion, MultipleChoiceQuestion, CheckboxQuestion, CheckboxGridQuestion, Action, Form } from '../../../typings'
import { v4 as uuid } from 'uuid'
import { DropdownQuestion } from '../../../typings'
import { LinearScaleQuestion } from '../../../typings'
import { MultipleChoiceGridQuestion } from '../../../typings'
import { DateQuestion } from '../../../typings'
import { TimeQuestion } from '../../../typings'
import { createForm, getForm } from '../../../api'
import { useNavigate, useParams } from 'react-router-dom'
import { renderEditQuestion } from '../../../utils'
import { useTitle } from '../../../hooks/useTitle'

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
        question: "",
        subQuestions: [],
        required: false,
        options: [],
      } as MultipleChoiceGridQuestion
    case "CheckboxGrid":
      return {
        id: uuid(),
        type: "CheckboxGrid",
        question: "",
        subQuestions: [],
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

export const DashboardForm = () => {
  const [title, setTitle] = useTitle("Wellytics - Form");

  const navigate = useNavigate();
  const { id: _id } = useParams();
  const id = useMemo(() => _id!, [_id])

  const [ready, setReady] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, dispatch] = useReducer(questionsReducer, []);
  const [selectedType, setSelectedType] = useState<string>(questionTypes[0]);

  const initialize = useCallback(async () => {
    const { title, description, questions } = await getForm(id);
    setFormTitle(title);
    setTitle(title);
    setDescription(description);
    dispatch({ type: "initialize", payload: questions });
    setReady(true);
  }, [setFormTitle, setDescription, dispatch, id, setTitle]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

  const onChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
  }, [setFormTitle]);

  const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, [setDescription]);

  const onClickSave = useCallback(async () => {
    const form: Form = {
      id,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      title: formTitle,
      description, questions
    };
    console.log(await createForm(form));
  }, [id, formTitle, description, questions]);

  const onClickFormResponses = useCallback((id: string) => {
    navigate(`/_/forms/${id}/responses`);
  }, [navigate]);

  return ready ? (
    <div>
      <Input placeholder="Title" value={formTitle} onChange={onChangeTitle} />

      <Input placeholder="Description" value={description} onChange={onChangeDescription} />

      <Button onClick={() => onClickFormResponses(id)}>
        Responses
      </Button>

      <div>
        {questions.map((question: Question) => renderEditQuestion(question, dispatch))}
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
