import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useTitle = (title: string): [string, Dispatch<SetStateAction<string>>] => {
    const [documentTitle, setDocumentTitle] = useState(title);

    useEffect(() => {
        document.title = documentTitle;
    }, [documentTitle]);

    return [documentTitle, setDocumentTitle];
};