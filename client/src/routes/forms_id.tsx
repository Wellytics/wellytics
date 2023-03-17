import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Response, Action, Answers, FormSnapshot } from '../typings';
import { createResponse, getForm } from '../api';
import { Button, Typography } from 'antd';
import { renderQuestion, resolveEmptyAnswers } from '../utils';
import { v4 as uuid } from 'uuid';
import { useTrackingId } from '../hooks/useTrackingId';

const { Title, Text } = Typography;

const reducer = (answers: Answers, action: Action) => {
    switch (action.type) {
        case "initialize":
            return action.payload;
        case "update":
            return { ...answers, [action.payload.id]: action.payload.patch };
        case "updateInner":
            return {
                ...answers,
                [action.payload.id]: {
                    ...answers[action.payload.id] as Record<string, string>,
                    [action.payload.innerId]: action.payload.patch
                }
            }
        default:
            return answers;
    }
}

export const Form = () => {
    const navigate = useNavigate();
    const { formId } = useParams();

    const trackingId = useTrackingId();

    const [ready, setReady] = useState(false);
    const [form, setForm] = useState<FormSnapshot>();
    const [answers, dispatch] = useReducer(reducer, {});

    const id = useMemo(() => uuid(), []);

    const initialize = useCallback(async () => {
        const form = await getForm(formId!);
        const answers = resolveEmptyAnswers(form.questions);
        setForm(form);
        dispatch({ type: "initialize", payload: answers });
        setReady(true);
    }, [formId, setForm, setReady, dispatch]);

    useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

    const onClickSubmit = useCallback(async () => {
        const now = Math.floor(Date.now() / 1000);
        const response: Response = {
            id,
            createdAt: now,
            updatedAt: now,
            formId: formId!,
            trackingId,
            answers,
            metrics: []
        };
        await createResponse(formId!, response);
        navigate("/")
    }, [id, trackingId, answers, navigate, formId]);

    if (!ready) return <div>loading...</div>;
    if (!form) return <div>not found</div>;

    return (
        <div>
            <Title>{form.title}</Title>

            <Text>{form.description}</Text>

            <div>
                {form.questions.map((question) => renderQuestion(question, answers[question.id], dispatch))}
            </div>

            <Button onClick={onClickSubmit}>
                Submit
            </Button>
        </div>
    )
}
