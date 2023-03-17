import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createForm } from '../../../api'
import { resolveEmptyForm } from '../../../utils'

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
