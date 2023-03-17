import React, { FC } from 'react'
import { AnswerProps, LinearScaleAnswer, LinearScaleQuestion, QuestionProps } from '../../typings'
import { List, Slider, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerLinearScale: FC<AnswerProps<LinearScaleQuestion, LinearScaleAnswer>> = ({ question, answers }) => {
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
