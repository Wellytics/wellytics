import React, { FC } from 'react'
import { MultipleChoiceGridQuestion, QuestionProps } from '../../typings'
import { Radio, Typography } from 'antd';
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionMultipleChoiceGrid: FC<QuestionProps<MultipleChoiceGridQuestion>> = ({ question, dispatch }) => {
  const { onChangeInner } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>

      {question.subQuestions.map((subQuestion) => (
        <div key={subQuestion.id}>
          <Title level={5}>{subQuestion.question}</Title>
          <Radio.Group onChange={(e) =>
            onChangeInner(subQuestion.id, e.target.value)
          }>
            {question.options.map((option) => (
              <Radio key={option.id} value={option.id}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      ))}
    </div>
  )
}
