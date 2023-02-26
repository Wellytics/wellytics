import React, { FC } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxQuestion, QuestionProps } from '../../typings';

const { Title } = Typography;

export const QuestionCheckbox: FC<QuestionProps<CheckboxQuestion>> = ({ question: _question, dispatch }) => {
  const { question, options } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Checkbox.Group>
        {options.map((option) => (
          <Checkbox key={option.id}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  )
}
