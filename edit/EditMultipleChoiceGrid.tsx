import { Button, Checkbox, Input,Typography } from 'antd'
import React, { FC } from 'react'
import { MultipleChoiceGridQuestion, EditQuestionProps } from '../../typings'
import { useEdit } from './base'

const { Title } = Typography

export const EditMultipleChoiceGrid: FC<EditQuestionProps<MultipleChoiceGridQuestion>> = ({ question, dispatch }) => {
  const {
    onChangeQuestion,
    onChangeSubQuestion,
    onAddSubQuestion,
    onChangePlaceholder,
    onChangeRequired,
    onChangeOption,
    onAddOption
  } = useEdit(question.id, dispatch);

  return (
    <div>
      <Title level={4}>Multiple Choice Grid</Title>

      <Input placeholder="Parent question" value={question.question} onChange={(e) => onChangeQuestion(e)} />

      <div>
        {question.subQuestions.map((question, i) => (
          <Input key={question.id} placeholder="Question" value={question.question} onChange={(e) => onChangeSubQuestion(question.id, e)} />
        ))}
      </div>

      <Button onClick={onAddSubQuestion}>Add question</Button>

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
