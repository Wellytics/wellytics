import React, { FC } from 'react'
import { DateQuestion, QuestionProps } from '../../typings'
import { DatePicker, Typography } from 'antd'

const { Title } = Typography;

export const QuestionDate: FC<QuestionProps<DateQuestion>> = ({question: _question, dispatch}) => {
  const { question } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <DatePicker />
    </div>
  )
}
