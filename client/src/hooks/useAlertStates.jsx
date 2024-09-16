import React, { useState } from 'react';


export const useErrorAlert = ({isTimeout=false, timeout=3000}) => {
    // State managerment for error alerts
    const [errorText, setErrorText] = useState("")
    const [showErrorAlert, setErrorAlert] = useState(false);
    const hideErrorAlert = () => setErrorAlert(false);
    const openErrorAlert = ({errorDetails}) => {
        // errorDetails is the message that shows in the alert
        if (errorDetails) {
            setErrorAlert(true);
            setErrorText(errorDetails);
            // isTimeout determines whether the alert automatically disappears, by default false
            // timeout is the length of time which the alert remains on screen, by default 3000 milliseconds
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
    // State management for event alerts
    const [eventText, setEventText] = useState("")
    const [showEventAlert, setEventAlert] = useState(false);
    const hideEventAlert = () => setEventAlert(false);
    const openEventAlert = ({eventDetails}) => {
        // errorDetails is the message that shows in the alert
        setEventAlert(true);
        setEventText(eventDetails);
        // isTimeout determines whether the alert automatically disappears, by default false
        // timeout is the length of time which the alert remains on screen, by default 3000 milliseconds
        if (isTimeout) {
            setTimeout(() => {hideEventAlert()}, timeout);  
        } 
    };

    return { showEventAlert, hideEventAlert, openEventAlert, eventText };
}
