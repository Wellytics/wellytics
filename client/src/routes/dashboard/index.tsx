import React, { useCallback, useEffect, useState } from 'react'
import { getForms } from '../../api';
import { Form } from '../../typings';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);

  const initialize = useCallback(async () => {
    const forms = await getForms();
    setForms(forms);
    setReady(true);
  }, [setReady, setForms]);

  useEffect(() => { initialize() }, [initialize]);

  const onClickForm = useCallback((id: string) => {
    navigate(`/dashboard/forms/${id}`);
  }, [navigate]);

  return ready ? (
    <div>
      {forms.map(form => (
        <Button key={form.id} onClick={() => onClickForm(form.id)}>{form.title}</Button>
      ))}

      <Button onClick={() => navigate('/dashboard/forms/new')}>New Form</Button>
    </div>
  ) : null;
}
