import React, { useState} from 'react';

// State management for ViewPasswordModal
export const useViewModal = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const openViewModal = () => setShowViewModal(true);
    const hideViewModal = () => setShowViewModal(false);

    return {showViewModal, hideViewModal, openViewModal};
}


// State management for EditPasswordModal
export const useEditModal = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const openEditModal = () => setShowEditModal(true);
    const hideEditModal = () => setShowEditModal(false);

    return {showEditModal, hideEditModal, openEditModal}
}


// State management for DeletePasswordModal
export const useDeleteModal = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openDeleteModal = () => setShowDeleteModal(true);
    const hideDeleteModal = () => setShowDeleteModal(false);

    return {showDeleteModal, hideDeleteModal, openDeleteModal};
}

// State management for DeleteAccountModal
export const useDeleteAccountModal = () => {
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const openDeleteAccountModal = () => setShowDeleteAccountModal(true);
    const hideDeleteAccountModal = () => setShowDeleteAccountModal(false);

    return {showDeleteAccountModal, hideDeleteAccountModal, openDeleteAccountModal};
}


// State management for ErrorModal
export const useErrorModal = () => {
    const [showErrorTitle, setErrorTitle] = useState("");
    const [showErrorText, setErrorText] = useState("");
    const [showErrorModal, setErrorModal] = useState(false);
    const hideErrorModal = () => setErrorModal(false);
    const openErrorModal = ({errorTitle, errorDetails}) => {
        // errorTitle = title of modal, errorDetails = message in modal
        setErrorModal(true);
        setErrorTitle(errorTitle);
        setErrorText(errorDetails);
    }

    return {showErrorModal, hideErrorModal, openErrorModal, showErrorTitle, showErrorText}
}

