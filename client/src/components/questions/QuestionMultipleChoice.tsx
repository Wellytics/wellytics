import React, { FC } from 'react'
import { MultipleChoiceQuestion, QuestionProps } from '../../typings'
import { Radio, Typography } from 'antd'

const { Title } = Typography;

export const QuestionMultipleChoice: FC<QuestionProps<MultipleChoiceQuestion>> = ({ question: _question, dispatch }) => {
  const { question, options } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>

      <Radio.Group>
        {options.map((option) => (
          <Radio key={option.id} value={option.id}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  )
}
