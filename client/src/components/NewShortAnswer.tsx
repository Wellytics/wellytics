import React, { FC } from 'react'
import { NewQuestionProps } from '../routes/dashboard/new'
import { Checkbox, Input } from 'antd'

export const NewShortAnswer: FC<NewQuestionProps> = () => {
  return (
    <div>
      <Input placeholder="Question" />
      <Input placeholder="Placeholder" />
      <Checkbox>Required</Checkbox>
    </div>
  )
}
