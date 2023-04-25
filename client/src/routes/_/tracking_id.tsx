import React, { useCallback, useEffect, useState } from "react";
import { Layout, Breadcrumb, Typography } from "antd";
import { useParams } from "react-router-dom";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { MetricsCurves } from "../../components/MetricsCurves";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Metric } from "../../typings";
import { getTrackingId } from "../../api";
import Curves from "../../components/Curves";

const { Content } = Layout;
const { Title } = Typography;

export const DashboardTrackingId = () => {
  const { trackingId } = useParams();

  const [ready, setReady] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const initialize = useCallback(async () => {
    const metrics = await getTrackingId(trackingId!);
    
    console.log(metrics);

    setMetrics(metrics);
    setReady(true);
  }, [trackingId]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  if (!ready) return <LoadingScreen />;

  return (
    <Layout className="h-full" style={{ padding: "0 50px", overflow: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Tracking</Breadcrumb.Item>
        <Breadcrumb.Item>{trackingId}</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ paddingBottom: "50px" }}>
        <Title
          style={{
            marginBottom: 0,
          }}
        >
          {trackingId}
        </Title>
        <div className="w-full h-full">
          <ParentSize>
            {({ width, height }) => (
              <Curves width={width} height={height} />
            )}
          </ParentSize>
        </div>
      </Content>
    </Layout>
  );
};
