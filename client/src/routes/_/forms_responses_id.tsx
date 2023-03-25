import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormSnapshot, ResponseSnapshot } from "../../typings";
import { getForm, getResponse } from "../../api";
import { List, Space, Typography } from "antd";

const { Title, Text } = Typography;

export const DashboardFormResponse = () => {
  const navigate = useNavigate();
  const { formId, responseId } = useParams();

  const [ready, setReady] = useState(false);
  const [response, setResponse] = useState<ResponseSnapshot>();
  const [form, setForm] = useState<FormSnapshot>();

  const initialize = useCallback(async () => {
    const response = await getResponse(formId!, responseId!);
    const form = await getForm(formId!);

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
      question: question.question,
      answer: JSON.stringify(response.answers[question.id]),
    }));
  }, [response, form]);

  if (!ready) return <div>loading...</div>;
  if (!response) return <div>not found</div>;
  if (!form) return <div>not found</div>;

  return (
    <div>
      <Title>{response.id}</Title>
      <List
        bordered
        dataSource={data}
        renderItem={({ question, answer }) => (
          <List.Item>
            <Space direction="vertical">
              <Title level={3}>{question}</Title>
              <Text>{answer}</Text>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};
