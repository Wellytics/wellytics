import React, { FC, useCallback } from 'react'
import { Checkbox, List, Typography } from 'antd'
import { AnswerProps, CheckboxGridAnswer, CheckboxGridQuestion, QuestionProps } from '../../typings';
import { useAnswer } from './base';

const { Title } = Typography;

export const AnswerCheckboxGrid: FC<AnswerProps<CheckboxGridQuestion, CheckboxGridAnswer>> = ({ question, answers }) => {
  return (
    <div>
      <Title level={4}>Checkbox grid</Title>

      <div>
        {question.subQuestions.map((question, i) => (
          <div key={i}>
            <Title level={5}>{question.question}</Title>
            <List
              bordered
              dataSource={answers}
              renderItem={(answer) => (
                <List.Item>
                  {/* @ts-ignore */}
                  <Typography.Text>{JSON.stringify(answer.answer[i])}</Typography.Text>
                </List.Item>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
