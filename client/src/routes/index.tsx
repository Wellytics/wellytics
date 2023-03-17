import React, { useCallback, useEffect, useState } from 'react'
import { FormView } from '../typings';
import { useNavigate } from 'react-router-dom';
import { getForms } from '../api';
import { Button } from 'antd';

export const Root = () => {
    const navigate = useNavigate();

    const [ready, setReady] = useState(false);
    const [formViews, setFormViews] = useState<FormView[]>([]);

    const initialize = useCallback(async () => {
        const formViews = await getForms();
        setFormViews(formViews);
        setReady(true);
    }, [setReady, setFormViews]);

    useEffect(() => { if (!ready) initialize() }, [ready, initialize]);

    const onClickDashboard = useCallback(() => {
        navigate('/_');
    }, [navigate]);

    const onClickForm = useCallback((formId: string) => {
        navigate(`/forms/${formId}`);
    }, [navigate]);

    if (!ready) return <div>loading...</div>;

    return (
        <div>
            <Button onClick={onClickDashboard}>
                Dashboard
            </Button>

            <div>
                {formViews.map((formView) => (
                    <Button key={formView.id} onClick={() => onClickForm(formView.id)}>
                        {formView.title}
                    </Button>
                ))}
            </div>
        </div>
    )
}
