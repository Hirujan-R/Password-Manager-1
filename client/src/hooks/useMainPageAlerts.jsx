import React, { useState } from 'react';

export const useShowCopyTextAlert = () => {
    const [showCopyTextAlert, setShowCopyTextAlert] = useState(false);
    const hideShowCopyTextAlert = () => setShowCopyTextAlert(false);
    const openShowCopyTextAlert = () => {
        setShowCopyTextAlert(true);
        setTimeout(() => {hideShowCopyTextAlert()}, 2000);  
    }

    return {showCopyTextAlert, hideShowCopyTextAlert, openShowCopyTextAlert};
}

export const usePasswordCreatedAlert = () => {
    const [showPasswordCreatedAlert, setPasswordCreatedAlert] = useState(false);
    const hidePasswordCreatedAlert = () => setPasswordCreatedAlert(false);
    const openPasswordCreatedAlert = () => {
        setPasswordCreatedAlert(true);
        setTimeout(() => {hidePasswordCreatedAlert()}, 2000);  
    }

    return {showPasswordCreatedAlert, hidePasswordCreatedAlert, openPasswordCreatedAlert};
}

export const usePasswordEdittedAlert = () => {
    const [showPasswordEdittedAlert, setPasswordEdittedAlert] = useState(false);
    const hidePasswordEdittedAlert = () => setPasswordEdittedAlert(false);
    const openPasswordEdittedAlert = () => {
        setPasswordEdittedAlert(true);
        setTimeout(() => {hidePasswordEdittedAlert()}, 2000);  
    }

    return {showPasswordEdittedAlert, hidePasswordEdittedAlert, openPasswordEdittedAlert};
}

export const usePasswordDeletedAlert = () => {
    const [showPasswordDeletedAlert, setPasswordDeletedAlert] = useState(false);
    const hidePasswordDeletedAlert = () => setPasswordDeletedAlert(false);
    const openPasswordDeletedAlert = () => {
        setPasswordDeletedAlert(true);
        setTimeout(() => {hidePasswordDeletedAlert()}, 2000);  
    }

    return {showPasswordDeletedAlert, hidePasswordDeletedAlert, openPasswordDeletedAlert};
}

