import { Button, Typography } from 'antd';
import React, { Dispatch, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  useParams,
} from "react-router-dom";
import { getForm } from '../api';
import { Action, Answer, Form as IForm, Question } from '../typings';
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

const { Title, Text } = Typography;

export const renderQuestion = (question: Question, dispatch: Dispatch<Action>) => {
  switch (question.type) {
    case "ShortAnswer":
      return <QuestionShortAnswer key={question.id} question={question} dispatch={dispatch} />
    case "LongAnswer":
      return <QuestionLongAnswer key={question.id} question={question} dispatch={dispatch} />
    case "MultipleChoice":
      return <QuestionMultipleChoice key={question.id} question={question} dispatch={dispatch} />
    case "Checkbox":
      return <QuestionCheckbox key={question.id} question={question} dispatch={dispatch} />
    case "Dropdown":
      return <QuestionDropdown key={question.id} question={question} dispatch={dispatch} />
    case "LinearScale":
      return <QuestionLinearScale key={question.id} question={question} dispatch={dispatch} />
    case "MultipleChoiceGrid":
      return <QuestionMultipleChoiceGrid key={question.id} question={question} dispatch={dispatch} />
    case "CheckboxGrid":
      return <QuestionCheckboxGrid key={question.id} question={question} dispatch={dispatch} />
    case "Date":
      return <QuestionDate key={question.id} question={question} dispatch={dispatch} />
    case "Time":
      return <QuestionTime key={question.id} question={question} dispatch={dispatch} />
  }
}

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
        {form.questions.map((question) => renderQuestion(question, dispatch))}
      </div>

      <Button onClick={onClickSubmit}>
        Submit
      </Button>
    </div>
  ) : null
}
