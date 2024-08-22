import React, { useState } from 'react';


export const useErrorAlert = ({isTimeout=false, timeout=3000}) => {
    const [errorText, setErrorText] = useState("")
    const [showErrorAlert, setErrorAlert] = useState(false);
    const hideErrorAlert = () => setErrorAlert(false);
    const openErrorAlert = (errorDetails) => {
        setErrorAlert(true);
        setErrorText(errorDetails);
        if (isTimeout) {
            setTimeout(() => {hideErrorAlert()}, timeout);  
        } 
    };

    return { showErrorAlert, hideErrorAlert, openErrorAlert, errorText };
}
