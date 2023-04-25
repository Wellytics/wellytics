import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FormSnapshot, Keyword, ResponseSnapshot } from "../../typings";
import {
  getForm,
  getResponse,
  getResponseAnalytics,
  hasResponseAnalytics,
} from "../../api";
import { List, Space, Typography } from "antd";
import { LoadingScreen } from "../../components/LoadingScreen";
import HighlightedText from "../../components/HighlightedText";

const { Title } = Typography;

export const DashboardFormResponse = () => {
  const { formId, responseId } = useParams();

  const [ready, setReady] = useState(false);
  const [response, setResponse] = useState<ResponseSnapshot>();
  const [form, setForm] = useState<FormSnapshot>();
  const [keywords, setKeywords] = useState<Record<string, Keyword[]>>({});

  const initialize = useCallback(async () => {
    const response = await getResponse(formId!, responseId!);
    const form = await getForm(formId!);

    if (await hasResponseAnalytics(formId!, responseId!)) {
      const analytics = await getResponseAnalytics(formId!, responseId!);
      setKeywords(analytics.keywords!);
    }

    setResponse(response);
    setForm(form);
    setReady(true);
  }, [formId, responseId, setResponse, setForm, setReady]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  const data = useMemo(() => {
    if (!response) return [];
    if (!form) return [];

    return form.questions.map((question) => ({
      questionId: question.id,
      question: question.question,
      answer: JSON.stringify(response.answers[question.id]),
    }));
  }, [response, form]);

  if (!ready) return <LoadingScreen />;
  if (!response) return <div>not found</div>;
  if (!form) return <div>not found</div>;

  return (
    <div>
      <Title>{response.id}</Title>
      <List
        bordered
        dataSource={data}
        renderItem={({ questionId, question, answer }) => (
          <List.Item>
            <Space direction="vertical">
              <Title level={3}>{question}</Title>
              <HighlightedText
                text={answer}
                keywords={keywords[questionId] || []}
              />
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};
