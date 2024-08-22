import React, { useState} from 'react';

// Modal for viewing password
export const useViewModal = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const openViewModal = () => setShowViewModal(true);
    const hideViewModal = () => setShowViewModal(false);

    return {showViewModal, hideViewModal, openViewModal};
}


// Modal for editting password
export const useEditModal = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const openEditModal = () => setShowEditModal(true);
    const hideEditModal = () => setShowEditModal(false);

    return {showEditModal, hideEditModal, openEditModal}
}


// Modal for deleting password
export const useDeleteModal = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openDeleteModal = () => setShowDeleteModal(true);
    const hideDeleteModal = () => setShowDeleteModal(false);

    return {showDeleteModal, hideDeleteModal, openDeleteModal};
}

// If service name input field is empty on submit
export function useEmptyServiceNameAlert() {
    const [showEmptyServiceNameAlert, setshowEmptyServiceNameAlert] = useState(false);
    const hideEmptyServiceNameAlert = () => setshowEmptyServiceNameAlert(false);
    const openEmptyServiceNameAlert = () => { setshowEmptyServiceNameAlert(true); };

    return { showEmptyServiceNameAlert, hideEmptyServiceNameAlert, openEmptyServiceNameAlert };
}

// If service password input field is empty on submit
export const useEmptyServicePasswordAlert = () => {
    const [showEmptyServicePasswordAlert, setshowEmptyServicePasswordAlert] = useState(false);
    const hideEmptyServicePasswordAlert = () => setshowEmptyServicePasswordAlert(false);
    const openEmptyServicePasswordAlert = () => {setshowEmptyServicePasswordAlert(true);};

    return { showEmptyServicePasswordAlert, hideEmptyServicePasswordAlert, openEmptyServicePasswordAlert };
}