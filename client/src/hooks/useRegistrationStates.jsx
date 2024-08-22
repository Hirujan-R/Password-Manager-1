import React, { useState } from 'react';


export const useGeneralErrorAlert = () => {
    const [errorText, setErrorText] = useState("")
    const [showGeneralErrorAlert, setGeneralErrorAlert] = useState(false);
    const hideGeneralErrorAlert = () => setGeneralErrorAlert(false);
    const openGeneralErrorAlert = (errorDetails) => {
        setGeneralErrorAlert(true);
        setErrorText(errorDetails);
        setTimeout(() => {hideGeneralErrorAlert()}, 3000);  
    };

    return { showGeneralErrorAlert, hideGeneralErrorAlert, openGeneralErrorAlert, errorText };
}
