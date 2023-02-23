import { Button, Checkbox, Input } from 'antd'
import React, { FC } from 'react'
import { NewQuestionProps } from '../routes/dashboard/new'

export const NewCheckbox: FC<NewQuestionProps> = ({ }) => {
  return (
    <div>
      <Input placeholder="Question" />
      <Input placeholder="Placeholder" />
      <Checkbox>Required</Checkbox>

      <div>

      </div>

      <Button>Add option</Button>
    </div>
  )
}
