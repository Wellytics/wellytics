import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormView, QuestionView, TrackingView } from "../../typings";
import { getForms, getQuestions, getTrackingViews } from "../../api";
import { Breadcrumb, Button, Card, Layout, Space, Typography } from "antd";
import { LoadingScreen } from "../../components/LoadingScreen";

const { Content } = Layout;
const { Title, Text } = Typography;

const buildFormDescription = (formView: FormView) => {
  const { createdAt, updatedAt, description } = formView;

  const createdAtDate = new Date(createdAt).toLocaleString();
  const updatedAtDate = new Date(updatedAt).toLocaleString();

  return `Created at ${createdAtDate} and last updated at ${updatedAtDate}. ${description}`;
};

const buildQuestionDescription = (questionView: QuestionView) => {
  const { createdAt, updatedAt } = questionView;

  const createdAtDate = new Date(createdAt).toLocaleString();
  const updatedAtDate = new Date(updatedAt).toLocaleString();

  return `Created at ${createdAtDate} and last updated at ${updatedAtDate}.`;
};

const buildTrackingDescription = (trackingView: TrackingView) => {
  const { createdAt, updatedAt } = trackingView;

  const createdAtDate = new Date(createdAt).toLocaleString();
  const updatedAtDate = new Date(updatedAt).toLocaleString();

  return `Created at ${createdAtDate} and last updated at ${updatedAtDate}.`;
};

export const DashboardRoot = () => {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [formViews, setFormViews] = useState<FormView[]>([]);
  const [questionViews, setQuestionViews] = useState<QuestionView[]>([]);
  const [trackingViews, setTrackingViews] = useState<TrackingView[]>([]);

  const [formDescriptions, setFormDescriptions] = useState<string[]>([]);
  const [questionDescriptions, setQuestionDescriptions] = useState<string[]>(
    []
  );
  const [trackingDescriptions, setTrackingDescriptions] = useState<string[]>(
    []
  );

  const initialize = useCallback(async () => {
    const [formViews, questionViews, trackingViews] = await Promise.all([
      getForms(false),
      getQuestions(),
      getTrackingViews(),
    ]);

    const formDescriptions = formViews.map(buildFormDescription);
    const questionDescriptions = questionViews.map(buildQuestionDescription);
    const trackingDescriptions = trackingViews.map(buildTrackingDescription);

    setFormViews(formViews);
    setQuestionViews(questionViews);
    setTrackingViews(trackingViews);
    setFormDescriptions(formDescriptions);
    setQuestionDescriptions(questionDescriptions);
    setTrackingDescriptions(trackingDescriptions);
    setReady(true);
  }, []);

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

  // const onClickMetrics = useCallback(() => {
  //   navigate(`/_/metrics`);
  // }, [navigate]);

  const onClickTracking = useCallback(
    (trackingId: string) => {
      navigate(`/_/tracking/${trackingId}`);
    },
    [navigate]
  );

  if (!ready) return <LoadingScreen />;

  return (
    <Layout className="h-full" style={{ padding: "0 50px", overflow: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ paddingBottom: "50px" }}>
        <Space direction="vertical" className="w-full">
          <Title>Forms</Title>

          <Space
            style={{
              maxHeight: 500,
              overflow: "auto",
            }}
            wrap
            direction="horizontal"
          >
            {formViews.map((formView, i) => (
              <Card
                title={formView.title}
                extra={
                  <Button type="link" onClick={() => onClickForm(formView.id)}>
                    Go
                  </Button>
                }
                style={{ width: 300 }}
              >
                <Text>{formDescriptions[i]}</Text>
              </Card>
            ))}
          </Space>

          <Title>Questions</Title>

          <Space
            style={{
              maxHeight: 500,
              overflow: "auto",
            }}
            wrap
            direction="horizontal"
          >
            {questionViews.map((questionView, i) => (
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
                <Text>{questionDescriptions[i]}</Text>
              </Card>
            ))}
          </Space>

          {/* <Title>Metrics</Title>

          <Button type="link" onClick={onClickMetrics}>
            Go
          </Button> */}

          <Title>Tracking</Title>

          <Space
            style={{
              maxHeight: 500,
              overflow: "auto",
            }}
            wrap
            direction="horizontal"
          >
            {trackingViews.map((trackingView, i) => (
              <Card
                title={trackingView.id}
                extra={
                  <Button
                    type="link"
                    onClick={() => onClickTracking(trackingView.id)}
                  >
                    Go
                  </Button>
                }
                style={{ width: 300 }}
              >
                <Text>{trackingDescriptions[i]}</Text>
              </Card>
            ))}
          </Space>
        </Space>
      </Content>
    </Layout>
  );
};
