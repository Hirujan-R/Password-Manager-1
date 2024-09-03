import React, { useState } from 'react';


export const useErrorAlert = ({isTimeout=false, timeout=3000}) => {
    const [errorText, setErrorText] = useState("")
    const [showErrorAlert, setErrorAlert] = useState(false);
    const hideErrorAlert = () => setErrorAlert(false);
    const openErrorAlert = ({errorDetails}) => {
        if (!errorDetails) {console.log("No error details")}
        else {
            setErrorAlert(true);
            setErrorText(errorDetails);
            if (isTimeout) {
                const timeoutId = setTimeout(() => {
                    hideErrorAlert();
                }, timeout);  
                return () => clearTimeout(timeoutId);
            }
        } 
    };

    return { showErrorAlert, hideErrorAlert, openErrorAlert, errorText };
}

export const useEventAlert = ({isTimeout=true, timeout=2000}) => {
    const [eventText, setEventText] = useState("")
    const [showEventAlert, setEventAlert] = useState(false);
    const hideEventAlert = () => setEventAlert(false);
    const openEventAlert = (eventDetails) => {
        setEventAlert(true);
        setEventText(eventDetails);
        if (isTimeout) {
            setTimeout(() => {hideEventAlert()}, timeout);  
        } 
    };

    return { showEventAlert, hideEventAlert, openEventAlert, eventText };
}
