import React, { FC } from 'react'
import { AnswerProps, MultipleChoiceGridAnswer, MultipleChoiceGridQuestion, QuestionProps } from '../../typings'
import { List, Radio, Typography } from 'antd';
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerMultipleChoiceGrid: FC<AnswerProps<MultipleChoiceGridQuestion, MultipleChoiceGridAnswer>> = ({ question, answers }) => {
  return (
    <div>
      <Title level={4}>Multiple choice grid</Title>
      <div>
        {question.subQuestions.map((question, i) => (
          <div key={i}>
            <Title level={5}>{question.question}</Title>
            <List
              bordered
              dataSource={answers}
              renderItem={(answer) => (
                <List.Item>
                  <Typography.Text>{answer.answer}</Typography.Text>
                </List.Item>
              )}
            />
          </div>
        ))}
      </div>

    </div>
  )
}
