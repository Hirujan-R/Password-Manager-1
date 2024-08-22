import React, { useState } from 'react';


export const useGeneralErrorAlert = ({isTimeout=false, timeout=3000}) => {
    const [errorText, setErrorText] = useState("")
    const [showGeneralErrorAlert, setGeneralErrorAlert] = useState(false);
    const hideGeneralErrorAlert = () => setGeneralErrorAlert(false);
    const openGeneralErrorAlert = (errorDetails) => {
        setGeneralErrorAlert(true);
        setErrorText(errorDetails);
        if (isTimeout) {
            setTimeout(() => {hideGeneralErrorAlert()}, timeout);  
        } 
    };

    return { showGeneralErrorAlert, hideGeneralErrorAlert, openGeneralErrorAlert, errorText };
}
