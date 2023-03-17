import { Dispatch, useCallback, useMemo } from "react"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Action } from "../../typings"

export const useEdit = (questionId: string, dispatch: Dispatch<Action>) => {
    const onChangeQuestion = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'update',
            payload: {
                id: questionId,
                patch: {
                    question: e.target.value
                }
            }
        })
    }, [questionId, dispatch])

    const onChangePlaceholder = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'update',
            payload: {
                id: questionId,
                patch: {
                    placeholder: e.target.value
                }
            }
        })
    }, [questionId, dispatch])

    const onChangeRequired = useCallback((e: CheckboxChangeEvent) => {
        dispatch({
            type: 'update',
            payload: {
                id: questionId,
                patch: {
                    required: e.target.checked
                }
            }
        })
    }, [questionId, dispatch])

    const onChangeOption = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'updateOption',
            payload: {
                id: questionId,
                optionId: id,
                patch: {
                    label: e.target.value
                }
            }
        })
    }, [questionId, dispatch])

    const onAddOption = useCallback(() => {
        dispatch({
            type: 'newOption',
            payload: {
                id: questionId
            }
        })
    }, [questionId, dispatch])

    const onChangeMin = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'update',
            payload: {
                id: questionId,
                patch: {
                    min: e.target.value
                }
            }
        })
    }, [questionId, dispatch])

    const onChangeMax = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'update',
            payload: {
                id: questionId,
                patch: {
                    max: e.target.value
                }
            }
        })
    }, [questionId, dispatch])

    const onChangeSubQuestion = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'updateSubQuestion',
            payload: {
                id: questionId,
                subQuestionId: id,
                patch: {
                    question: e.target.value
                }
            }
        })
    }, [questionId, dispatch])

    const onAddSubQuestion = useCallback(() => {
        dispatch({
            type: 'newSubQuestion',
            payload: {
                id: questionId
            }
        })
    }, [questionId, dispatch])

    const hook = useMemo(() => ({
        onChangeQuestion,
        onChangePlaceholder,
        onChangeRequired,
        onChangeOption,
        onAddOption,
        onChangeMin,
        onChangeMax,
        onChangeSubQuestion,
        onAddSubQuestion
    }), [
        onChangeQuestion,
        onChangePlaceholder,
        onChangeRequired,
        onChangeOption,
        onAddOption,
        onChangeMin,
        onChangeMax,
        onChangeSubQuestion,
        onAddSubQuestion
    ]);

    return hook;
}