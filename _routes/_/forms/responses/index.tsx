import { Button, Typography } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getForm, getKeywords, getResponses, joinJob } from '../../../../api';
import { Question, Response } from '../../../../typings';
import { renderAnswerQuestion } from '../../../../utils';

export const DashboardFormResponses = () => {
  const [title, setTitle] = useState("Wellytics - Responses");

  const { id: _id } = useParams();
  const id = useMemo(() => _id!, [_id])

  const [ready, setReady] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);

  const initialize = useCallback(async () => {
    const { title, description, questions } = await getForm(id);
    const responses = await getResponses(id);

    setFormTitle(title);
    setTitle(title);
    setDescription(description);
    setQuestions(questions);
    setResponses(responses);
    setReady(true);
  }, [setTitle, setFormTitle, setDescription, setQuestions, setResponses, setReady, id]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

  const onClickKeywords = useCallback(async () => {
    console.log(await joinJob(await getKeywords(id), () => {
      console.log("progress")
    }));
  }, [id]);

  return ready ? (
    <div>
      <Typography.Title>{formTitle}</Typography.Title>
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
