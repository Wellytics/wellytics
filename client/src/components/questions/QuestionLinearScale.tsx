import React, { FC } from 'react'
import { LinearScaleAnswer, LinearScaleQuestion, QuestionProps } from '../../typings'
import { Slider, Typography } from 'antd'
import { useAnswer } from './base';

const { Title } = Typography;

export const QuestionLinearScale: FC<QuestionProps<LinearScaleQuestion, LinearScaleAnswer>> = ({ question: _question, answer, dispatch }) => {
  const { onChangeAnswer } = useAnswer(answer.id, dispatch)

  const { question, min, max } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Slider onChange={onChangeAnswer} min={parseInt(min as unknown as string)} max={parseInt(max as unknown as string)} />
    </div>
  )
}
