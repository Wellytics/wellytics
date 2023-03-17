import React, { FC } from 'react'
import { QuestionProps, TimeQuestion } from '../../typings'
import { TimePicker, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionTime: FC<QuestionProps<TimeQuestion, string>> = ({ question, answer, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <TimePicker onChange={(e) => onChange(e?.toISOString())} />
    </div>
  )
}
