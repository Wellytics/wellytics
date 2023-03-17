import React, { FC } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxGridQuestion, QuestionProps } from '../../typings';
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionCheckboxGrid: FC<QuestionProps<
  CheckboxGridQuestion,
  Record<string, string>
>> = ({ question, answer, dispatch }) => {
  const { onChangeInner } = useAnswer(answer.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>

      {question.subQuestions.map((subQuestion) => (
        <div key={subQuestion.id}>
          <Title level={5}>{subQuestion.question}</Title>
          <Checkbox.Group onChange={(values) => onChangeInner(subQuestion.id, values)}>
            {question.options.map((option) => (
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
