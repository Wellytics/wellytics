import { useMemo } from "react"
import { v4 as uuid } from "uuid"

export const useTrackingId = () => {
    const trackingId = useMemo(() => {
        let _trackingId = localStorage.getItem("trackingId");
        if (!_trackingId) {
            _trackingId = uuid();
            localStorage.setItem("trackingId", _trackingId);
        }
        return _trackingId;
    }, [])

    return trackingId;
}
