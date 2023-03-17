import React, { FC } from 'react'
import { AnswerProps, MultipleChoiceAnswer, MultipleChoiceQuestion, QuestionProps } from '../../typings'
import { List, Radio, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerMultipleChoice: FC<AnswerProps<MultipleChoiceQuestion, MultipleChoiceAnswer>> = ({ question, answers }) => {
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
