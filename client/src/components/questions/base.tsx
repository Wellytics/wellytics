import { Dispatch, useCallback, useMemo } from "react";
import { Action } from "../../typings";

export const useAnswer = (id: string, dispatch: Dispatch<Action>) => {
    const onChange = useCallback(<T,>(value: T) => {
        dispatch({
            type: 'update',
            payload: {
                id,
                patch: value
            }
        })
    }, [id, dispatch]);

    const onChangeInner = useCallback(<T,>(innerId: string, value: T) => {
        dispatch({
            type: 'updateInner',
            payload: {
                id,
                innerId: innerId,
                patch: value
            }
        })
    }, [id, dispatch]);

    const hook = useMemo(() => ({
        onChange,
        onChangeInner,
    }), [
        onChange,
        onChangeInner,
    ]);

    return hook;
}
