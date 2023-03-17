import { Dispatch, useCallback, useMemo } from "react";
import { Action } from "../../typings";

export const useAnswer = (answerId: string, dispatch: Dispatch<Action>) => {
    const onChangeAnswer = useCallback(<T,>(value: T) => {
        dispatch({
            type: 'update',
            payload: {
                id: answerId,
                patch: { answer: value }
            }
        })
    }, [answerId, dispatch]);

    const onChangeSubAnswer = useCallback(<T,>(i: number, value: T) => {
        dispatch({
            type: 'updateSubAnswer',
            payload: {
                id: answerId,
                i: i,
                patch: value
            }
        })
    }, [answerId, dispatch]);

    const hook = useMemo(() => ({
        onChangeAnswer,
        onChangeSubAnswer,
    }), [
        onChangeAnswer,
        onChangeSubAnswer,
    ]);

    return hook;
}
