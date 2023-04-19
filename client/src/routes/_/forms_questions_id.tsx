import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Keyword, Question, ResponseSnapshot } from "../../typings";
import {
  getFormAnalytics,
  getQuestion,
  getResponses,
  hasFormAnalytics,
} from "../../api";
import { List, Typography } from "antd";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Radar } from "../../components/Radar";
import { LoadingScreen } from "../../components/LoadingScreen";
import HighlightedText from "../../components/HighlightedText";

const { Title } = Typography;

export const DashboardFormQuestion = () => {
  const { formId, questionId } = useParams();

  const [ready, setReady] = useState(false);
  const [question, setQuestion] = useState<Question>();
  const [responses, setResponses] = useState<ResponseSnapshot[]>();
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  const initialize = useCallback(async () => {
    const question = await getQuestion(questionId!);
    const responses = await getResponses(formId!);

    if (await hasFormAnalytics(formId!)) {
      const analytics = await getFormAnalytics(formId!);
      setKeywords(analytics.keywords![questionId!]);
    }

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

  if (!ready) return <LoadingScreen />;
  if (!question) return <div>not found</div>;
  if (!responses) return <div>not found</div>;

  return (
    <div>
      <Title>{question.question}</Title>

      <div className="w-full h-96 shadow">
        <ParentSize>
          {({ width, height }) => <Radar width={width} height={height} />}
        </ParentSize>
      </div>

      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <HighlightedText text={item} keywords={keywords} />
          </List.Item>
        )}
      />
    </div>
  );
};
