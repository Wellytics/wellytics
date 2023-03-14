import React, { useCallback, useEffect, useState } from 'react'
import { useTitle } from '../hooks/useTitle'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom';
import { Form } from '../typings';
import { getForms } from '../api';

const { Title } = Typography;

export const Index = () => {
  const [title, setTitle] = useTitle("Brothers on The Rise")

  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);

  const initialize = useCallback(async () => {
    const forms = await getForms();
    setForms(forms);
    setReady(true);
  }, [setForms]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

  const onClickDashboard = useCallback(() => {
    navigate('/_');
  }, [navigate])

  const onClickForm = useCallback((formId: string) => {
    navigate(`/forms/${formId}`);
  }, [navigate])

  return (
    <div>
      <Title>
        {title}
      </Title>

      <Button onClick={onClickDashboard}>
        Dashboard
      </Button>

      <div>
        {forms.map((form) => (
          <Button key={form.id} onClick={() => onClickForm(form.id)}>
            {form.title}
          </Button>
        ))}
      </div>
    </div>
  )
}
