import React, { useCallback, useEffect, useState } from 'react'
import { getForms } from '../../api';
import { Form } from '../../typings';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [title, setTitle] = useState("Wellytics");

  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);

  const initialize = useCallback(async () => {
    const forms = await getForms();
    setForms(forms);
    setReady(true);
  }, [setReady, setForms]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

  const onClickEditForm = useCallback((id: string) => {
    navigate(`/_/forms/${id}`);
  }, [navigate]);

  return ready ? (
    <div>
      <div>
        {forms.map(form => (
          <Button key={form.id} onClick={() => onClickEditForm(form.id)}>Edit {form.title}</Button>
        ))}
      </div>

      <Button onClick={() => navigate('/_/forms/new')}>New Form</Button>
    </div>
  ) : null;
}
