import React, { FC } from 'react'
import { QuestionProps, TimeAnswer, TimeQuestion } from '../../typings'
import { TimePicker, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionTime: FC<QuestionProps<TimeQuestion, TimeAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <TimePicker onChange={(e) => onChangeAnswer(e?.toISOString())} />
    </div>
  )
}
