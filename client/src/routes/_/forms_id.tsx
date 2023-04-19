import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useOutlet, useParams } from "react-router-dom";
import {
  getForm,
  getFormAnalytics,
  getResponses,
  hasFormAnalytics,
  setFormActive,
} from "../../api";
import {
  FormAnalytics,
  FormSnapshot,
  Question,
  ResponseAnalytics,
  ResponseSnapshot,
} from "../../typings";
import {
  Typography,
  Drawer,
  Button,
  Layout,
  Breadcrumb,
  Space,
  FloatButton,
  Tooltip,
  Card,
  Switch,
} from "antd";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { LoadingScreen } from "../../components/LoadingScreen";
import { EmotionsBarStack } from "../../components/EmotionsBarStack";

const { Content } = Layout;
const { Title, Text } = Typography;

const buildQuestionDescription = (question: Question) => {
  const { createdAt, updatedAt } = question;

  const createdAtDate = new Date(createdAt).toLocaleString();
  const updatedAtDate = new Date(updatedAt).toLocaleString();

  return `Created at ${createdAtDate}, last updated at ${updatedAtDate}`;
};

const hydrateQuestionDescription = (
  question: Question,
  analytics: FormAnalytics
) => {
  const { createdAt } = question;

  const createdAtDate = new Date(createdAt).toLocaleString();

  const keywords = analytics
    .keywords![question.id].map((keyword) => keyword.label)
    .slice(0, 3);

  return `Keywords: ${keywords.join(", ")}. Created at ${createdAtDate}.`;
};

const buildResponseDescription = (response: ResponseSnapshot) => {
  const { createdAt } = response;

  const createdAtDate = new Date(createdAt).toLocaleString();

  return `Created at ${createdAtDate}.`;
};

const hydrateResponseDescription = (
  response: ResponseSnapshot,
  responseAnalytics: ResponseAnalytics
) => {
  const { createdAt } = response;

  const createdAtDate = new Date(createdAt).toLocaleString();

  // const keywords = responseAnalytics
  //   .keywords!.map((keyword) => keyword.label)
  //   .slice(0, 3);

  return `Created at ${createdAtDate}.`;
};

const PlotsPlaceholder: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="w-full h-96 rounded border-4 border-dashed border-slate flex flex-row justify-center items-center">
        {children}
      </div>
      <div className="w-full h-96 rounded border-4 border-dashed border-slate"></div>
      <div className="w-full h-96 rounded border-4 border-dashed border-slate"></div>
    </>
  );
};

export const DashboardForm = () => {
  const navigate = useNavigate();
  const outlet = useOutlet();
  const { formId } = useParams();

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<FormSnapshot>();
  const [responses, setResponses] = useState<ResponseSnapshot[]>();
  const [questionDescriptions, setQuestionDescriptions] = useState<string[]>(
    []
  );
  const [responseDescriptions, setResponseDescriptions] = useState<string[]>(
    []
  );
  const [analytics, setAnalytics] = useState<FormAnalytics | undefined>();
  const [responseAnalytics, setResponseAnalytics] = useState<
    Record<string, ResponseAnalytics>
  >({});

  const hydrateDescriptions = useCallback(
    async (
      form: FormSnapshot,
      responses: ResponseSnapshot[],
      analytics: FormAnalytics
    ) => {
      const questionDescriptions = form!.questions.map((question) =>
        hydrateQuestionDescription(question, analytics)
      );

      const responseAnalytics = Object.fromEntries(
        analytics.responseAnalytics!.map((response) => [response.id, response])
      );

      const responseDescriptions = responses!.map((response) =>
        hydrateResponseDescription(response, responseAnalytics[response.id]!)
      );

      setQuestionDescriptions(questionDescriptions);
      setResponseDescriptions(responseDescriptions);
    },
    []
  );

  const loadAnalytics = useCallback(
    async (form: FormSnapshot, responses: ResponseSnapshot[]) => {
      const analytics = await getFormAnalytics(form.id);

      const responseAnalytics = Object.fromEntries(
        analytics.responseAnalytics!.map((response) => [response.id, response])
      );

      hydrateDescriptions(form, responses, analytics);

      setAnalytics(analytics);
      setResponseAnalytics(responseAnalytics);
    },
    [hydrateDescriptions]
  );

  const initialize = useCallback(async () => {
    const form = await getForm(formId!);
    const responses = await getResponses(formId!);

    const questionDescriptions = form.questions.map(buildQuestionDescription);
    const responseDescriptions = responses.map(buildResponseDescription);

    if (await hasFormAnalytics(formId!)) loadAnalytics(form, responses);

    setForm(form);
    setResponses(responses);

    setQuestionDescriptions(questionDescriptions);
    setResponseDescriptions(responseDescriptions);

    setReady(true);
  }, [formId, setForm, setResponses, setReady, loadAnalytics]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  const onClickGetAnalytics = useCallback(async () => {
    loadAnalytics(form!, responses!);
  }, [form, responses, loadAnalytics]);

  // const onClickEdit = useCallback(() => {
  //   navigate(`/_/forms/${formId}/edit`);
  // }, [navigate, formId]);

  const onClickQuestion = useCallback(
    (questionId: string) => {
      navigate(`/_/forms/${formId}/questions/${questionId}`);
    },
    [navigate, formId]
  );

  const onClickResponse = useCallback(
    (responseId: string) => {
      navigate(`/_/forms/${formId}/responses/${responseId}`);
    },
    [navigate, formId]
  );

  const onCloseOutlet = useCallback(() => {
    navigate(`/_/forms/${formId}`);
  }, [navigate, formId]);

  const onSetFormActive = useCallback(
    async (active: boolean) => {
      await setFormActive(formId!, active);
      const form = await getForm(formId!);
      setForm(form);
    },
    [formId]
  );

  if (!ready) return <LoadingScreen />;
  if (!form) return <div>not found</div>;
  if (!responses) return <LoadingScreen />;

  return (
    <>
      <Layout
        className="h-full"
        style={{ padding: "0 50px", overflow: "auto" }}
      >
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Forms</Breadcrumb.Item>
          <Breadcrumb.Item>{form.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* <FloatButton.Group shape="square" style={{ left: 24 }}>
          <Tooltip placement="right" title="Edit">
            <FloatButton onClick={onClickEdit} />
          </Tooltip>
        </FloatButton.Group> */}

        <Content style={{ paddingBottom: "50px" }}>
          <Space direction="vertical" className="w-full">
            <div className="flex flex-row gap-2 items-center">
              <Title
                style={{
                  marginBottom: 0,
                }}
              >
                {form.title}
              </Title>

              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                checked={form.active}
                onChange={onSetFormActive}
              />
            </div>

            <Text>{form.description}</Text>

            <div className="flex flex-row gap-2">
              {analytics === undefined || analytics.status === "Pending" ? (
                <PlotsPlaceholder>
                  {analytics?.status === "Pending" ? (
                    <Text>Generating analytics...</Text>
                  ) : (
                    <Button onClick={onClickGetAnalytics}>Get analytics</Button>
                  )}
                </PlotsPlaceholder>
              ) : (
                <>
                  <div className="w-full h-96 shadow">
                    <ParentSize>
                      {({ width, height }) => (
                        <EmotionsBarStack
                          width={width}
                          height={height}
                          data={analytics.emotions!}
                        />
                      )}
                    </ParentSize>
                  </div>
                  <div className="w-full h-96 rounded border-4 border-dashed border-slate"></div>
                  <div className="w-full h-96 rounded border-4 border-dashed border-slate"></div>
                </>
              )}
            </div>

            <Title level={2}>Questions</Title>

            <Space
              style={{
                maxHeight: 500,
                overflow: "auto",
              }}
              wrap
              direction="horizontal"
            >
              {form.questions.map((question, i) => (
                <Card
                  title={question.question}
                  extra={
                    <Button
                      type="link"
                      onClick={() => onClickQuestion(question.id)}
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

            <Title level={2}>Responses (n = {responses.length})</Title>

            <Space
              style={{
                maxHeight: 500,
                overflow: "auto",
              }}
              wrap
              direction="horizontal"
            >
              {responses.map((response, i) => (
                <Card
                  title={response.id}
                  extra={
                    <Button
                      type="link"
                      onClick={() => onClickResponse(response.id)}
                    >
                      Go
                    </Button>
                  }
                  style={{ width: 300 }}
                >
                  <Text>{responseDescriptions[i]}</Text>
                </Card>
              ))}
            </Space>
          </Space>
        </Content>
      </Layout>

      <Drawer width={1000} open={!!outlet} onClose={onCloseOutlet}>
        {outlet}
      </Drawer>
    </>
  );
};
