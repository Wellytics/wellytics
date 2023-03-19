import React, { FC } from 'react'
import { DateQuestion, QuestionProps } from '../../typings'
import { DatePicker, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionDate: FC<QuestionProps<DateQuestion>> = ({ question, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <DatePicker onChange={(v) => onChange(v?.toISOString())} />
    </div>
  )
}
