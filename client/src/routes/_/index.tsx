import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormView, QuestionView } from '../../typings';
import { getForms, getQuestions } from '../../api';
import { Button, Typography } from 'antd';

const { Title } = Typography;

export const DashboardRoot = () => {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [formViews, setFormViews] = useState<FormView[]>([]);
  const [questionViews, setQuestionViews] = useState<QuestionView[]>([]);

  const initialize = useCallback(async () => {
    const [formViews, questionViews] = await Promise.all([
      getForms(false),
      getQuestions()
    ]);

    setFormViews(formViews);
    setQuestionViews(questionViews);
    setReady(true);
  }, [setReady, setFormViews, setQuestionViews]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

  if (!ready) return <div>loading...</div>;

  return (
    <div>
      <Title>Forms</Title>

      <div>
        {formViews.map((formView) => (
          <Button key={formView.id}>
            {formView.title}
          </Button>
        ))}
      </div>

      <Title>Questions</Title>

      <div>
        {questionViews.map((questionView) => (
          <Button key={questionView.id}>
            {questionView.question}
          </Button>
        ))}
      </div>

      <Title>Metrics</Title>

      <Button>
        Go
      </Button>

      <Title>Tracking</Title>

      <Button>
        Go
      </Button>
    </div>
  )
}
