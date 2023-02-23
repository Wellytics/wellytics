import { Checkbox, Input } from 'antd'
import React, { FC, useCallback } from 'react'
import { NewQuestionProps } from '../routes/dashboard/edit'
import { LinearScaleQuestion } from '../typings'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

export const NewLinearScale: FC<NewQuestionProps<LinearScaleQuestion>> = ({ question, dispatch }) => {
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

  const onChangeMin = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'update',
      payload: {
        id: question.id,
        patch: {
          min: e.target.value
        }
      }
    })
  }, [dispatch])

  const onChangeMax = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'update',
      payload: {
        id: question.id,
        patch: {
          max: e.target.value
        }
      }
    })
  }, [dispatch])

  return (
    <div>
      <Input placeholder="Question" value={question.question} onChange={onChangeQuestion} />
      <Input placeholder="Placeholder" value={question.placeholder} onChange={onChangePlaceholder} />
      <Checkbox checked={question.required} onChange={onChangeRequired}>Required</Checkbox>
      <Input placeholder="Min" value={question.min} onChange={onChangeMin} />
      <Input placeholder="Max" value={question.max} onChange={onChangeMax} />
    </div>
  )
}
