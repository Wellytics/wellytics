import React, { useCallback, useEffect, useState } from "react";
import { FormView } from "../typings";
import { useNavigate } from "react-router-dom";
import { getForms, ping } from "../api";
import { Breadcrumb, Button, Card, Layout, Space, Typography } from "antd";
import { LoadingScreen } from "../components/LoadingScreen";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

export const Root = () => {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [formViews, setFormViews] = useState<FormView[]>([]);
  const [gotPong, setGotPong] = useState(false);

  const initialize = useCallback(async () => {
    const formViews = await getForms();
    const pong = await ping();
    setFormViews(formViews);
    setGotPong(pong);
    setReady(true);
  }, [setReady, setFormViews]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  const onClickDashboard = useCallback(() => {
    navigate("/_");
  }, [navigate]);

  const onClickForm = useCallback(
    (formId: string) => {
      navigate(`/forms/${formId}`);
    },
    [navigate]
  );

  if (!ready) return <LoadingScreen />;

  return (
    <Layout className="h-full" style={{ padding: "0 50px", overflow: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Forms</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ paddingBottom: "50px" }}>
        <Space direction="vertical" className="w-full">
          <Title>Welcome to Brothers on The Rise's Wellytics platform!</Title>

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
        </Space>
      </Content>
      {gotPong && (
        <Footer style={{ textAlign: "center" }}>
          <Button type="link" onClick={onClickDashboard}>
            Go to dashboard
          </Button>
        </Footer>
      )}
    </Layout>
  );
};
