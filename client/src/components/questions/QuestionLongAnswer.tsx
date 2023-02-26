import React, { FC } from 'react'
import { LongAnswerQuestion, QuestionProps } from '../../typings'
import { Input, Typography } from 'antd'

const { Title } = Typography;

export const QuestionLongAnswer: FC<QuestionProps<LongAnswerQuestion>> = ({ question: _question, dispatch }) => {
  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Input.TextArea />
    </div>
  )
}
