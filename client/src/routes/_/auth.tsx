import React, { useCallback } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Breadcrumb,
  Layout,
  Space,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;

interface AuthValues {
  email: string;
  password: string;
}

export const DashboardAuth = () => {
  const navigate = useNavigate();

  const onFinish = useCallback(
    async (values: AuthValues) => {
      // TODO: For demo-ing purposes
      navigate("/_");
    },
    [navigate]
  );

  return (
    <Layout className="h-full" style={{ padding: "0 50px", overflow: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Auth</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ paddingBottom: "50px" }}>
        <Space direction="vertical" className="w-full">
          <Title>Sign in</Title>

          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                  type: "email",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" style={{ width: "100%" }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Content>
    </Layout>
  );
};
