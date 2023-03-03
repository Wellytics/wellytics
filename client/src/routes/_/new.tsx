import React, { useCallback, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { createForm } from '../../api'

export const resolveEmptyForm = () => {
  return {
    id: uuid(),
    title: '',
    description: '',
    questions: [],
  }
}

export const DashboardNewForm = () => {
  const navigate = useNavigate()

  const initialize = useCallback(async () => {
    const form = resolveEmptyForm();
    await createForm(form);
    navigate(`/dashboard/forms/${form.id}`)
  }, []);

  useEffect(() => { initialize() }, [initialize]);

  return null;
}
