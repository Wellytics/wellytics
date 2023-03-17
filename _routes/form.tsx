import { Button, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { getForm } from '../api';
import { Action, Answer, Form as IForm, Question } from '../typings';
import { v4 as uuid } from 'uuid';
import { createResponse } from '../api';
import { renderQuestion, resolveEmptyAnswer } from '../utils';
import { useTitle } from '../hooks/useTitle';
import { useTrackingId } from '../hooks/useTrackingId';

const { Title, Text } = Typography;

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
  const [title, setTitle] = useTitle("Wellytics - Form")
  const trackingId = useTrackingId();

  const navigate = useNavigate();
  const { id: _formId } = useParams();
  const formId = useMemo(() => _formId!, [_formId]);

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<IForm | null>(null);

  const id = useMemo(() => uuid(), []);
  const [answers, dispatch] = useReducer(answersReducer, []);

  const initialize = useCallback(async () => {
    const form = await getForm(formId);

    const answers = form.questions.map(resolveEmptyAnswer);

    setForm(form);
    setTitle(form.title);
    dispatch({ type: "initialize", payload: answers });
    setReady(true);
  }, [formId, setTitle]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

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
