import { Button, Checkbox, Input, Typography } from 'antd'
import React, { FC } from 'react'
import { CheckboxQuestion, EditQuestionProps } from '../../typings'
import { useEdit } from './base'

const { Title } = Typography

export const EditCheckbox: FC<EditQuestionProps<CheckboxQuestion>> = ({ question, dispatch }) => {
  const {
    onChangeQuestion,
    onChangePlaceholder,
    onChangeRequired,
    onChangeOption,
    onAddOption
  } = useEdit(question.id, dispatch)

  return (
    <div>
      <Title level={4}>Checkbox</Title>
      <Input placeholder="Question" value={question.question} onChange={onChangeQuestion} />
      <Input placeholder="Placeholder" value={question.placeholder} onChange={onChangePlaceholder} />
      <Checkbox checked={question.required} onChange={onChangeRequired}>Required</Checkbox>

      <div>
        {question.options.map((option) => (
          <Input key={option.id} placeholder="Label" value={option.label} onChange={(e) => onChangeOption(option.id, e)} />
        ))}
      </div>

      <Button onClick={onAddOption}>Add option</Button>
    </div>
  )
}
