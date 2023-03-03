import React, { FC } from 'react'
import { AnswerProps, DateAnswer, DateQuestion, QuestionProps } from '../../typings'
import { DatePicker, List, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerDate: FC<AnswerProps<DateQuestion, DateAnswer>> = ({ question, answers }) => {
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
