import { Checkbox, Input, Typography } from 'antd'
import React, { FC } from 'react'
import { LinearScaleQuestion, EditQuestionProps } from '../../typings'
import { useEdit } from './base'

const { Title } = Typography

export const EditLinearScale: FC<EditQuestionProps<LinearScaleQuestion>> = ({ question, dispatch }) => {
  const {
    onChangeQuestion,
    onChangePlaceholder,
    onChangeRequired,
    onChangeMin,
    onChangeMax
  } = useEdit(question.id, dispatch);

  return (
    <div>
      <Title level={4}>Linear Scale</Title>

      <Input placeholder="Question" value={question.question} onChange={onChangeQuestion} />
      <Input placeholder="Placeholder" value={question.placeholder} onChange={onChangePlaceholder} />
      <Checkbox checked={question.required} onChange={onChangeRequired}>Required</Checkbox>
      <Input placeholder="Min" value={question.min} onChange={onChangeMin} />
      <Input placeholder="Max" value={question.max} onChange={onChangeMax} />
    </div>
  )
}
