import React, { FC } from 'react'
import { DateAnswer, DateQuestion, QuestionProps } from '../../typings'
import { DatePicker, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionDate: FC<QuestionProps<DateQuestion, DateAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <DatePicker onChange={(v) => onChangeAnswer(v?.toISOString())} />
    </div>
  )
}
