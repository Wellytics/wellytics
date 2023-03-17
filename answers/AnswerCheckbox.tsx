import React, { FC } from 'react'
import { Checkbox, List, Typography } from 'antd'
import { AnswerProps, CheckboxAnswer, CheckboxQuestion, QuestionProps } from '../../typings';
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerCheckbox: FC<AnswerProps<CheckboxQuestion, CheckboxAnswer>> = ({ question, answers }) => {
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
