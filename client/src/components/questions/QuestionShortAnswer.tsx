import React, { FC } from 'react'
import { QuestionProps, ShortAnswerAnswer, ShortAnswerQuestion } from '../../typings'
import { Input, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionShortAnswer: FC<QuestionProps<ShortAnswerQuestion, ShortAnswerAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Input onChange={(e) => onChangeAnswer(e.target.value)} />
    </div>
  )
}
