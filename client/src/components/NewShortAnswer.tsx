import { Checkbox, Input } from 'antd'
import React, { FC, useCallback } from 'react'
import { NewQuestionProps } from '../routes/dashboard/edit'
import { ShortAnswerQuestion } from '../typings'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

export const NewShortAnswer: FC<NewQuestionProps<ShortAnswerQuestion>> = ({ question, dispatch }) => {
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

  return (
    <div>
      <Input placeholder="Question" value={question.question} onChange={onChangeQuestion} />
      <Input placeholder="Placeholder" value={question.placeholder} onChange={onChangePlaceholder} />
      <Checkbox checked={question.required} onChange={onChangeRequired}>Required</Checkbox>
    </div>
  )
}
