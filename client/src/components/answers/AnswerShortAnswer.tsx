import React, { FC } from 'react'
import { AnswerProps, QuestionProps, ShortAnswerAnswer, ShortAnswerQuestion } from '../../typings'
import { Input, List, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerShortAnswer: FC<AnswerProps<ShortAnswerQuestion, ShortAnswerAnswer>> = ({ question, answers }) => {
  return (
    <div>
      <Title level={4}>{question.question}</Title>
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
  )
}
