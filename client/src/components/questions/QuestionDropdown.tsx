import React, { FC } from 'react'
import { DropdownAnswer, DropdownQuestion, QuestionProps } from '../../typings'
import { Select, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionDropdown: FC<QuestionProps<DropdownQuestion, DropdownAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question, options } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Select onChange={onChangeAnswer} options={options.map((option) => ({
        label: option.label,
        value: option.id,
      }))} />
    </div>
  )
}
