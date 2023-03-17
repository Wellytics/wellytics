import React, { FC } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxQuestion, QuestionProps } from '../../typings';
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionCheckbox: FC<QuestionProps<CheckboxQuestion, string>> = ({ question, answer, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <Checkbox.Group onChange={onChange}>
        {question.options.map((option) => (
          <Checkbox key={option.id} value={option.id}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  )
}
