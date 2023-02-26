import React, { FC } from 'react'
import { QuestionProps, ShortAnswerQuestion } from '../../typings'
import { Input, Typography } from 'antd'

const { Title } = Typography;

export const QuestionShortAnswer: FC<QuestionProps<ShortAnswerQuestion>> = ({ question: _question, dispatch }) => {
  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Input />
    </div>
  )
}
