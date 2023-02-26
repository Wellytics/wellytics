import { Checkbox, Input } from 'antd'
import React, { FC } from 'react'
import { LongAnswerQuestion, EditQuestionProps } from '../../typings'
import { useEdit } from './base'

export const EditLongAnswer: FC<EditQuestionProps<LongAnswerQuestion>> = ({ question, dispatch }) => {
  const {
    onChangeQuestion,
    onChangePlaceholder,
    onChangeRequired,
  } = useEdit(question.id, dispatch)

  return (
    <div>
      <Input placeholder="Question" value={question.question} onChange={onChangeQuestion} />
      <Input placeholder="Placeholder" value={question.placeholder} onChange={onChangePlaceholder} />
      <Checkbox checked={question.required} onChange={onChangeRequired}>Required</Checkbox>
    </div>
  )
}
