import { Button, Typography } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getForm, getKeywords, getResponses, joinJob } from '../../api';
import { Answer, Question, Response } from '../../typings';
import { AnswerShortAnswer } from '../../components/answers/AnswerShortAnswer';
import { AnswerLongAnswer } from '../../components/answers/AnswerLongAnswer';
import { AnswerMultipleChoice } from '../../components/answers/AnswerMultipleChoice';
import { AnswerCheckbox } from '../../components/answers/AnswerCheckbox';
import { AnswerDropdown } from '../../components/answers/AnswerDropdown';
import { AnswerLinearScale } from '../../components/answers/AnswerLinearScale';
import { AnswerMultipleChoiceGrid } from '../../components/answers/AnswerMultipleChoiceGrid';
import { AnswerCheckboxGrid } from '../../components/answers/AnswerCheckboxGrid';
import { AnswerDate } from '../../components/answers/AnswerDate';
import { AnswerTime } from '../../components/answers/AnswerTime';

export const renderAnswerQuestion = (question: Question, answers: Answer[]) => {
  switch (question.type) {
    case "ShortAnswer":
      return <AnswerShortAnswer key={question.id} question={question} answers={answers} />
    case "LongAnswer":
      return <AnswerLongAnswer key={question.id} question={question} answers={answers} />
    case "MultipleChoice":
      return <AnswerMultipleChoice key={question.id} question={question} answers={answers} />
    case "Checkbox":
      return <AnswerCheckbox key={question.id} question={question} answers={answers} />
    case "Dropdown":
      return <AnswerDropdown key={question.id} question={question} answers={answers} />
    case "LinearScale":
      return <AnswerLinearScale key={question.id} question={question} answers={answers} />
    case "MultipleChoiceGrid":
      return <AnswerMultipleChoiceGrid key={question.id} question={question} answers={answers} />
    case "CheckboxGrid":
      return <AnswerCheckboxGrid key={question.id} question={question} answers={answers} />
    case "Date":
      return <AnswerDate key={question.id} question={question} answers={answers} />
    case "Time":
      return <AnswerTime key={question.id} question={question} answers={answers} />
  }
}

export const DashboardFormResponses = () => {
  const { id: _id } = useParams();
  const id = useMemo(() => _id!, [_id])

  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);

  const initialize = useCallback(async () => {
    const { title, description, questions } = await getForm(id);
    const responses = await getResponses(id);

    setTitle(title);
    setDescription(description);
    setQuestions(questions);
    setResponses(responses);
    setReady(true);
  }, [setTitle, setDescription, setQuestions, setResponses, setReady, id]);

  useEffect(() => { initialize() }, [initialize]);

  const onClickKeywords = useCallback(async () => {
    console.log(await joinJob(await getKeywords(id), () => {
      console.log("progress")
    }));
  }, [id]);

  return ready ? (
    <div>
      <Typography.Title>{title}</Typography.Title>
      <Typography.Paragraph>{description}</Typography.Paragraph>

      <div>
        <Button onClick={onClickKeywords}>Keywords</Button>
        {/* {questions.map((question) => (
          // @ts-ignore
          <Button key={question.id}>{question.question}</Button>
        ))} */}
      </div>

      <div>
        {
          questions.map((question, i) => (
            renderAnswerQuestion(question, responses.map(response => response.answers[i]))
          ))
        }
      </div>

    </div>
  ) : null
}
