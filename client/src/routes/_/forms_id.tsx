import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutlet, useParams } from "react-router-dom";
import { getForm, getResponses } from "../../api";
import { FormSnapshot, ResponseSnapshot } from "../../typings";
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
} from "antd";
import { Radar } from "../../components/Radar";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Streamgraph } from "../../components/Streamgraph";
import { Bar } from "../../components/BarStack";

const { Content } = Layout;
const { Title, Text } = Typography;

export const DashboardForm = () => {
  const navigate = useNavigate();
  const outlet = useOutlet();
  const { formId } = useParams();

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<FormSnapshot>();
  const [responses, setResponses] = useState<ResponseSnapshot[]>();

  const initialize = useCallback(async () => {
    const form = await getForm(formId!);
    const responses = await getResponses(formId!);

    setForm(form);
    setResponses(responses);
    setReady(true);
  }, [formId, setForm, setResponses, setReady]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  const onClickEdit = useCallback(() => {
    navigate(`/_/forms/${formId}/edit`);
  }, [navigate, formId]);

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

  if (!ready) return <div>loading...</div>;
  if (!form) return <div>not found</div>;
  if (!responses) return <div>loading...</div>;

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

        <FloatButton.Group shape="square" style={{ left: 24 }}>
          <Tooltip placement="right" title="Edit">
            <FloatButton onClick={onClickEdit} />
          </Tooltip>
        </FloatButton.Group>

        <Content style={{ paddingBottom: "50px" }}>
          <Space direction="vertical" className="w-full">
            <Title>{form.title}</Title>

            <Text>{form.description}</Text>

            <div className="flex flex-row gap-2">
              <div className="w-full h-96 shadow">
                <ParentSize>
                  {({ width, height }) => (
                    <Radar width={width} height={height} />
                  )}
                </ParentSize>
              </div>
              <div className="w-full h-96 shadow">
                <ParentSize>
                  {({ width, height }) => (
                    <Streamgraph width={width} height={height} />
                  )}
                </ParentSize>
              </div>
              <div className="w-full h-96 shadow">
                <ParentSize>
                  {({ width, height }) => <Bar width={width} height={height} />}
                </ParentSize>
              </div>
            </div>

            <Title level={2}>Questions</Title>

            <Space wrap direction="horizontal">
              {form.questions.map((question) => (
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
                  <Text>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Numquam.
                  </Text>
                </Card>
              ))}
            </Space>

            <Title level={2}>Responses</Title>

            <Space wrap direction="horizontal">
              {responses.map((response) => (
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
                  <Text>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Numquam.
                  </Text>
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
