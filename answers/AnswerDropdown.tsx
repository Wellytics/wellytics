import React, { FC } from 'react'
import { AnswerProps, DropdownAnswer, DropdownQuestion, QuestionProps } from '../../typings'
import { List, Select, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerDropdown: FC<AnswerProps<DropdownQuestion, DropdownAnswer>> = ({ question, answers }) => {
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
