import React, { FC } from 'react'
import { MultipleChoiceQuestion, QuestionProps } from '../../typings'
import { Radio, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionMultipleChoice: FC<QuestionProps<MultipleChoiceQuestion, string>> = ({ question, answer, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>

      <Radio.Group onChange={(e) =>
        onChange(e.target.value)
      }>
        {question.options.map((option) => (
          <Radio key={option.id} value={option.id}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  )
}
