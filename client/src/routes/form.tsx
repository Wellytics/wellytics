import { Button, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  useParams,
} from "react-router-dom";
import { getForm } from '../api';
import { Answer, Form as IForm, Question } from '../typings';
import { v4 as uuid } from 'uuid';
import { Action } from './dashboard/edit';

const { Title, Text } = Typography;

export const renderQuestion = (question: Question) => { }

export const resolveEmptyAnswer = (question: Question) => { }

export const answersReducer = (answers: Answer[], action: Action) => {
  return answers
}

export const Form = () => {
  const { id: _formId } = useParams();
  const formId = useMemo(() => _formId!, [_formId]);

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<IForm | null>(null);

  const id = useMemo(() => uuid(), []);
  const trackingId = useMemo(() => uuid(), []);
  const [answers, dispatch] = useReducer(answersReducer, []);

  const initialize = useCallback(async () => {
    const form = await getForm(formId);
    setForm(form);
    setReady(true);
  }, [formId]);

  useEffect(() => { initialize() }, [initialize]);

  const onClickSubmit = useCallback(async () => { }, []);

  return ready && form ? (
    <div>
      <Title>{form.title}</Title>

      <Text>{form.description}</Text>

      <div>
        {form.questions.map((question) => (
          null
        ))}
      </div>

      <Button onClick={onClickSubmit}>
        Submit
      </Button>
    </div>
  ) : null
}
