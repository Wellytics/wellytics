import { Button, Checkbox, Input } from 'antd'
import React, { FC } from 'react'
import { NewQuestionProps } from '../../routes/dashboard/edit'
import { MultipleChoiceGridQuestion } from '../../typings'
import { useEdit } from './EditBase'

export const EditMultipleChoiceGrid: FC<NewQuestionProps<MultipleChoiceGridQuestion>> = ({ question, dispatch }) => {
  const {
    onChangeSubQuestion,
    onAddSubQuestion,
    onChangePlaceholder,
    onChangeRequired,
    onChangeOption,
    onAddOption
  } = useEdit(question.id, dispatch);

  return (
    <div>
      <div>
        {question.questions.map((question, i) => (
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
