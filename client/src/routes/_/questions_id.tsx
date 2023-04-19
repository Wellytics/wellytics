import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestion } from "../../api";
import { Question } from "../../typings";
import { Typography, Layout, Breadcrumb, Space, Switch, Input } from "antd";
import { LoadingScreen } from "../../components/LoadingScreen";

const { Content } = Layout;
const { Title, Text } = Typography;

export const DashboardQuestion = () => {
  const { questionId } = useParams();

  const [ready, setReady] = useState(false);
  const [question, setQuestion] = useState<Question>();

  const initialize = useCallback(async () => {
    const question = await getQuestion(questionId!);
    setQuestion(question);
    setReady(true);
  }, [setReady, questionId]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  if (!ready) return <LoadingScreen />;
  if (!question) return <div>Question not found</div>;

  return (
    <Layout className="h-full" style={{ padding: "0 50px", overflow: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Questions</Breadcrumb.Item>
        <Breadcrumb.Item>{question.question}</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ paddingBottom: "50px" }}>
        <Space direction="vertical" className="w-full">
          <Title
            style={{
              marginBottom: 0,
            }}
          >
            {question.question}
          </Title>

          <Text>Description</Text>

          {/* required */}
          <Switch
            checkedChildren="Required"
            unCheckedChildren="Not Required"
            defaultChecked={question.required}
          />

          {/* Question */}
          <Input placeholder="Question" defaultValue={question.question} />

          {/* Placeholder */}
          <Input
            placeholder="Placeholder"
            defaultValue={question.placeholder}
          />
        </Space>
      </Content>
    </Layout>
  );
};
