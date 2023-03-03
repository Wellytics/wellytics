import React, { FC } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxAnswer, CheckboxQuestion, QuestionProps } from '../../typings';
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionCheckbox: FC<QuestionProps<CheckboxQuestion, CheckboxAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question, options } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Checkbox.Group onChange={onChangeAnswer}>
        {options.map((option) => (
          <Checkbox key={option.id} value={option.id}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  )
}
