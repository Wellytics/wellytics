import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormView, QuestionView } from "../../typings";
import { getForms, getQuestions } from "../../api";
import { Breadcrumb, Button, Card, Layout, Space, Typography } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

export const DashboardRoot = () => {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [formViews, setFormViews] = useState<FormView[]>([]);
  const [questionViews, setQuestionViews] = useState<QuestionView[]>([]);

  const initialize = useCallback(async () => {
    const [formViews, questionViews] = await Promise.all([
      getForms(false),
      getQuestions(),
    ]);

    setFormViews(formViews);
    setQuestionViews(questionViews);
    setReady(true);
  }, [setReady, setFormViews, setQuestionViews]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  const onClickForm = useCallback(
    (formId: string) => {
      navigate(`/_/forms/${formId}`);
    },
    [navigate]
  );

  const onClickQuestion = useCallback(
    (questionId: string) => {
      navigate(`/_/questions/${questionId}`);
    },
    [navigate]
  );

  const onClickMetrics = useCallback(() => {
    navigate(`/_/metrics`);
  }, [navigate]);

  const onClickTracking = useCallback(() => {
    navigate(`/_/tracking`);
  }, [navigate]);

  if (!ready) return <div>loading...</div>;

  return (
    <Layout className="h-full" style={{ padding: "0 50px", overflow: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ paddingBottom: "50px" }}>
        <Space direction="vertical" className="w-full">
          <Title>Forms</Title>

          <Space wrap direction="horizontal">
            {formViews.map((formView) => (
              <Card
                title={formView.title}
                extra={
                  <Button type="link" onClick={() => onClickForm(formView.id)}>
                    Go
                  </Button>
                }
                style={{ width: 300 }}
              >
                <Text>{formView.description}</Text>
              </Card>
            ))}
          </Space>

          <Title>Questions</Title>

          <Space wrap direction="horizontal">
            {questionViews.map((questionView) => (
              <Card
                title={questionView.question}
                extra={
                  <Button
                    type="link"
                    onClick={() => onClickQuestion(questionView.id)}
                  >
                    Go
                  </Button>
                }
                style={{ width: 300 }}
              >
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quisquam quaerat pariatur corporis.
                </Text>
              </Card>
            ))}
          </Space>

          <Title>Metrics</Title>

          <Button type="link" onClick={onClickMetrics}>Go</Button>

          <Title>Tracking</Title>

          <Button type="link" onClick={onClickTracking}>Go</Button>
        </Space>
      </Content>
    </Layout>
  );
};
