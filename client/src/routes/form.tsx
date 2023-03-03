import { Button, Typography } from 'antd';
import React, { Dispatch, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { getForm } from '../api';
import { Action, Answer, CheckboxAnswer, CheckboxGridAnswer, DateAnswer, DropdownAnswer, Form as IForm, LinearScaleAnswer, LongAnswerAnswer, MultipleChoiceAnswer, MultipleChoiceGridAnswer, Question, ShortAnswerAnswer, TimeAnswer } from '../typings';
import { v4 as uuid } from 'uuid';
import { QuestionShortAnswer } from '../components/questions/QuestionShortAnswer';
import { QuestionLongAnswer } from '../components/questions/QuestionLongAnswer';
import { QuestionMultipleChoice } from '../components/questions/QuestionMultipleChoice';
import { QuestionCheckbox } from '../components/questions/QuestionCheckbox';
import { QuestionDropdown } from '../components/questions/QuestionDropdown';
import { QuestionLinearScale } from '../components/questions/QuestionLinearScale';
import { QuestionCheckboxGrid } from '../components/questions/QuestionCheckboxGrid';
import { QuestionDate } from '../components/questions/QuestionDate';
import { QuestionTime } from '../components/questions/QuestionTime';
import { QuestionMultipleChoiceGrid } from '../components/questions/QuestionMultipleChoiceGrid';
import { createResponse } from '../api';

const { Title, Text } = Typography;

export const renderQuestion = (question: Question, answer: Answer, dispatch: Dispatch<Action>) => {
  switch (question.type) {
    case "ShortAnswer":
      return <QuestionShortAnswer key={question.id} question={question} answer={answer as ShortAnswerAnswer} dispatch={dispatch} />
    case "LongAnswer":
      return <QuestionLongAnswer key={question.id} question={question} answer={answer as LongAnswerAnswer} dispatch={dispatch} />
    case "MultipleChoice":
      return <QuestionMultipleChoice key={question.id} question={question} answer={answer as MultipleChoiceAnswer} dispatch={dispatch} />
    case "Checkbox":
      return <QuestionCheckbox key={question.id} question={question} answer={answer as CheckboxAnswer} dispatch={dispatch} />
    case "Dropdown":
      return <QuestionDropdown key={question.id} question={question} answer={answer as DropdownAnswer} dispatch={dispatch} />
    case "LinearScale":
      return <QuestionLinearScale key={question.id} question={question} answer={answer as LinearScaleAnswer} dispatch={dispatch} />
    case "MultipleChoiceGrid":
      return <QuestionMultipleChoiceGrid key={question.id} question={question} answer={answer as MultipleChoiceGridAnswer} dispatch={dispatch} />
    case "CheckboxGrid":
      return <QuestionCheckboxGrid key={question.id} question={question} answer={answer as CheckboxGridAnswer} dispatch={dispatch} />
    case "Date":
      return <QuestionDate key={question.id} question={question} answer={answer as DateAnswer} dispatch={dispatch} />
    case "Time":
      return <QuestionTime key={question.id} question={question} answer={answer as TimeAnswer} dispatch={dispatch} />
  }
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
        answer: question.questions.map(() => ""),
      }
    case "CheckboxGrid":
      return {
        id: uuid(),
        type: "CheckboxGrid",
        questionId: question.id,
        answer: question.questions.map(() => []),
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

export const answersReducer = (answers: Answer[], action: Action) => {
  switch (action.type) {
    case "initialize":
      return action.payload;
    case "update":
      return answers.map((answer) =>
        answer.id === action.payload.id ? { ...answer, ...action.payload.patch }
          : answer
      );
    case "updateSubAnswer":
      return answers.map((answer) =>
        answer.id === action.payload.id ? {
          ...answer,
          // @ts-ignore
          answer: answer.answer.map((subAnswer, i) =>
            i === action.payload.i ? action.payload.patch
              : subAnswer
          )
        }
          : answer
      );
    default:
      return answers;
  }
}

export const Form = () => {
  const navigate = useNavigate();
  const { id: _formId } = useParams();
  const formId = useMemo(() => _formId!, [_formId]);

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<IForm | null>(null);

  const id = useMemo(() => uuid(), []);
  const trackingId = useMemo(() => uuid(), []);
  const [answers, dispatch] = useReducer(answersReducer, []);

  const initialize = useCallback(async () => {
    const form = await getForm(formId);

    const answers = form.questions.map((question) => resolveEmptyAnswer(question));

    setForm(form);
    dispatch({ type: "initialize", payload: answers });
    setReady(true);
  }, [formId]);

  useEffect(() => { initialize() }, [initialize]);

  const onClickSubmit = useCallback(async () => {
    const response = {
      id,
      trackingId,
      formId,
      answers,
    };
    await createResponse(formId, response);
    navigate("/");
  }, [navigate, id, formId, trackingId, answers]);

  return ready && form ? (
    <div>
      <Title>{form.title}</Title>

      <Text>{form.description}</Text>

      <div>
        {form.questions.map((question, i) => renderQuestion(question, answers[i], dispatch))}
      </div>

      <Button onClick={onClickSubmit}>
        Submit
      </Button>
    </div>
  ) : null
}
