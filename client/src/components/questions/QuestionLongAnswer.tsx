import React, { FC } from 'react'
import { LongAnswerAnswer, LongAnswerQuestion, QuestionProps } from '../../typings'
import { Input, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionLongAnswer: FC<QuestionProps<LongAnswerQuestion, LongAnswerAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Input.TextArea onChange={(e) => onChangeAnswer(e.target.value)} />
    </div>
  )
}
