import React, { FC } from 'react'
import { MultipleChoiceGridQuestion, QuestionProps } from '../../typings'
import { Radio, Typography } from 'antd';

const { Title } = Typography;

export const QuestionMultipleChoiceGrid: FC<QuestionProps<MultipleChoiceGridQuestion>> = ({ question: _question, dispatch }) => {
  const { questions, options } = _question;

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <Title level={4}>{question.question}</Title>
          <Radio.Group>
            {options.map((option) => (
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
