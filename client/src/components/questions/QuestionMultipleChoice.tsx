import React, { FC } from 'react'
import { MultipleChoiceAnswer, MultipleChoiceQuestion, QuestionProps } from '../../typings'
import { Radio, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionMultipleChoice: FC<QuestionProps<MultipleChoiceQuestion, MultipleChoiceAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question, options } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>

      <Radio.Group onChange={(e) =>
        onChangeAnswer(e.target.value)
      }>
        {options.map((option) => (
          <Radio key={option.id} value={option.id}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  )
}
