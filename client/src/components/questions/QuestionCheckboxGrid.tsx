import React, { FC, useCallback } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxGridAnswer, CheckboxGridQuestion, QuestionProps } from '../../typings';
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionCheckboxGrid: FC<QuestionProps<CheckboxGridQuestion, CheckboxGridAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeSubAnswer } = useAnswer(answer.id, dispatch)

  const { questions, options } = _question;

  return (
    <div>
      <Title level={4}>{_question.question}</Title>

      {questions.map((question, i) => (
        <div key={question.id}>
          <Title level={5}>{question.question}</Title>
          <Checkbox.Group onChange={(values) => onChangeSubAnswer(i, values)}>
            {options.map((option) => (
              <Checkbox key={option.id} value={option.id}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      ))}
    </div>
  )
}
