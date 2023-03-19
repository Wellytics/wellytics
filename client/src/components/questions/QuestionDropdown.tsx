import React, { FC } from 'react'
import { DropdownQuestion, QuestionProps } from '../../typings'
import { Select, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionDropdown: FC<QuestionProps<DropdownQuestion>> = ({ question, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <Select onChange={onChange} options={question.options.map((option) => ({
        label: option.label,
        value: option.id,
      }))} />
    </div>
  )
}
