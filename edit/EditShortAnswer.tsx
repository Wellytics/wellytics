import { Checkbox, Input, Typography } from 'antd'
import React, { FC } from 'react'
import { EditQuestionProps, ShortAnswerQuestion } from '../../typings'
import { useEdit } from './base'

const { Title } = Typography

export const EditShortAnswer: FC<EditQuestionProps<ShortAnswerQuestion>> = ({ question, dispatch }) => {
  const {
    onChangeQuestion,
    onChangePlaceholder,
    onChangeRequired,
  } = useEdit(question.id, dispatch)

  return (
    <div>
      <Title level={4}>Short Answer</Title>

      <Input placeholder="Question" value={question.question} onChange={onChangeQuestion} />
      <Input placeholder="Placeholder" value={question.placeholder} onChange={onChangePlaceholder} />
      <Checkbox checked={question.required} onChange={onChangeRequired}>Required</Checkbox>
    </div>
  )
}
