import React, { FC } from 'react'
import { LinearScaleQuestion, QuestionProps } from '../../typings'
import { Slider, Typography } from 'antd'

const { Title } = Typography;

export const QuestionLinearScale: FC<QuestionProps<LinearScaleQuestion>> = ({ question: _question, dispatch }) => {
  const { question, min, max } = _question;

  return (
    <div>
      <Title level={4}>{question}</Title>
      <Slider min={parseInt(min as unknown as string)} max={parseInt(max as unknown as string)} />
    </div>
  )
}
