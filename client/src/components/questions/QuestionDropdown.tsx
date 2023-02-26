import React, { FC } from 'react'
import { DropdownQuestion, QuestionProps } from '../../typings'
import { Select, Typography } from 'antd'

const { Title } = Typography;

export const QuestionDropdown: FC<QuestionProps<DropdownQuestion>> = ({ question: _question, dispatch }) => {
  const { question, options } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Select options={options.map((option) => ({
        label: option.label,
        value: option.id,
      }))} />
    </div>
  )
}
