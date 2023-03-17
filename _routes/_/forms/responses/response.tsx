import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTitle } from '../../../../hooks/useTitle';
import { useParams } from 'react-router-dom';
import { getResponse } from '../../../../api';

export const DashboardFormResponse = () => {
  const [title, setTitle] = useTitle("Wellytics - Response");

  const { id: _id, responseId: _responseId } = useParams();
  const id = useMemo(() => _id!, [_id])
  const responseId = useMemo(() => _responseId!, [_responseId])

  const [ready, setReady] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  const initialize = useCallback(async () => {
    const response = await getResponse(id, responseId);

    setResponse(response);
    setReady(true);
  }, [id, responseId, setReady]);

  useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

  return (
    <div>response</div>
  )
}
