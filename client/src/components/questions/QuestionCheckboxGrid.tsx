import React, { FC } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxGridQuestion, QuestionProps } from '../../typings';

const { Title } = Typography;

export const QuestionCheckboxGrid: FC<QuestionProps<CheckboxGridQuestion>> = ({ question: _question, dispatch }) => {
  const { questions, options } = _question;

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <Title level={4}>{question.question}</Title>
          <Checkbox.Group>
            {options.map((option) => (
              <Checkbox key={option.id}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      ))}
    </div>
  )
}
