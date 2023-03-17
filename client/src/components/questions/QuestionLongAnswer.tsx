import React, { FC } from 'react'
import { LongAnswerQuestion, QuestionProps } from '../../typings'
import { Input, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionLongAnswer: FC<QuestionProps<LongAnswerQuestion, string>> = ({ question, answer, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <Input.TextArea onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
