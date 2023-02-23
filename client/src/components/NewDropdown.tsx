import { Button, Checkbox, Input } from 'antd'
import React, { FC, useCallback } from 'react'
import { NewQuestionProps } from '../routes/dashboard/new'
import { DropdownQuestion } from '../typings'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

export const NewDropdown: FC<NewQuestionProps<DropdownQuestion>> = ({ question, dispatch }) => {
  const onChangeQuestion = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'update',
      payload: {
        id: question.id,
        patch: {
          question: e.target.value
        }
      }
    })
  }, [dispatch])

  const onChangePlaceholder = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'update',
      payload: {
        id: question.id,
        patch: {
          placeholder: e.target.value
        }
      }
    })
  }, [dispatch])

  const onChangeRequired = useCallback((e: CheckboxChangeEvent) => {
    dispatch({
      type: 'update',
      payload: {
        id: question.id,
        patch: {
          required: e.target.checked
        }
      }
    })
  }, [dispatch])

  const onChangeOption = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'updateOption',
      payload: {
        id: question.id,
        optionId: id,
        patch: {
          label: e.target.value
        }
      }
    })
  }, [dispatch])

  const onAddOption = useCallback(() => {
    dispatch({
      type: 'newOption',
      payload: {
        id: question.id
      }
    })
  }, [dispatch])

  return (
    <div>
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
