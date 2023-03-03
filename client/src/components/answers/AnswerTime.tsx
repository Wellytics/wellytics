import React, { FC } from 'react'
import { AnswerProps, TimeAnswer, TimeQuestion } from '../../typings'
import { List, Typography } from 'antd'

const { Title } = Typography;

export const AnswerTime: FC<AnswerProps<TimeQuestion, TimeAnswer>> = ({ question, answers }) => {
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
