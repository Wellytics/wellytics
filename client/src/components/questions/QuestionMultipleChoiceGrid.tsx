import React, { FC } from 'react'
import { MultipleChoiceGridAnswer, MultipleChoiceGridQuestion, QuestionProps } from '../../typings'
import { Radio, Typography } from 'antd';
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionMultipleChoiceGrid: FC<QuestionProps<MultipleChoiceGridQuestion, MultipleChoiceGridAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeSubAnswer } = useAnswer(answer.id, dispatch)

  const { questions, options } = _question;

  return (
    <div>
      {questions.map((question, i) => (
        <div key={question.id}>
          <Title level={4}>{question.question}</Title>
          <Radio.Group onChange={(e) =>
            onChangeSubAnswer(i, e.target.value)
          }>
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
