import React, { FC } from 'react'
import { LinearScaleQuestion, QuestionProps } from '../../typings'
import { Slider, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionLinearScale: FC<QuestionProps<LinearScaleQuestion, string>> = ({ question, answer, dispatch }) => {
  const { onChange } = useAnswer(question.id, dispatch)

  return (
    <div>
      <Title level={4}>{question.question}</Title>
      <Slider onChange={onChange} min={parseInt(question.min as unknown as string)} max={parseInt(question.max as unknown as string)} />
    </div>
  )
}
