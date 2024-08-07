import React, { useState } from 'react';



const useShowCopyTextAlert = () => {
    const [showCopyTextAlert, setShowCopyTextAlert] = useState(false);
    const hideShowCopyTextAlert = () => setShowCopyTextAlert(false);
    const openShowCopyTextAlert = () => {
        setShowCopyTextAlert(true);
        setTimeout(() => {hideShowCopyTextAlert()}, 2000);  
    }

    return {showCopyTextAlert, hideShowCopyTextAlert, openShowCopyTextAlert};
}

export default useShowCopyTextAlert;