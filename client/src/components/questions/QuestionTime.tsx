import React, { FC } from 'react'
import { QuestionProps, TimeQuestion } from '../../typings'
import { TimePicker, Typography } from 'antd'

const { Title } = Typography;

export const QuestionTime: FC<QuestionProps<TimeQuestion>> = () => {
  return (
    <div>
      <Title level={4}>Time</Title>
      <TimePicker />
    </div>
  )
}
