import React, { FC } from 'react'
import { QuestionProps, ShortAnswerQuestion } from '../../typings'
import { Input, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionShortAnswer: FC<QuestionProps<ShortAnswerQuestion, string>> = ({ question, answer, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <Input onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
