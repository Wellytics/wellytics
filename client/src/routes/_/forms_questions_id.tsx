import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Question, ResponseSnapshot } from "../../typings";
import { getQuestion, getResponses } from "../../api";
import { Carousel, List, Typography } from "antd";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Radar } from "../../components/Radar";
import { Streamgraph } from "../../components/Streamgraph";
import { Bar } from "../../components/BarStack";

const { Title, Text } = Typography;

export const DashboardFormQuestion = () => {
  const navigate = useNavigate();
  const { formId, questionId } = useParams();

  const [ready, setReady] = useState(false);
  const [question, setQuestion] = useState<Question>();
  const [responses, setResponses] = useState<ResponseSnapshot[]>();

  const initialize = useCallback(async () => {
    const question = await getQuestion(questionId!);
    const responses = await getResponses(formId!);

    setQuestion(question);
    setResponses(responses);
    setReady(true);
  }, [formId, questionId, setQuestion, setResponses, setReady]);

  useEffect(() => {
    if (!ready) initialize();
  }, [ready, initialize]);

  const data = useMemo(() => {
    if (!responses) return [];
    if (!questionId) return [];
    return responses
      .map((response) => response.answers[questionId])
      .map((answer) => JSON.stringify(answer));
  }, [responses, questionId]);

  if (!ready) return <div>loading...</div>;
  if (!question) return <div>not found</div>;
  if (!responses) return <div>not found</div>;

  return (
    <div>
      <Title>{question.question}</Title>

      <Carousel>
        <div className="w-full h-96 shadow">
          <ParentSize>
            {({ width, height }) => <Radar width={width} height={height} />}
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
      </Carousel>

      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Text>{item}</Text>
          </List.Item>
        )}
      />
    </div>
  );
};
