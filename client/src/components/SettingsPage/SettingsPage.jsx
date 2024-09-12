import React from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import {useEventAlert, useErrorAlert} from '../../hooks/useAlertStates'
import { useDeleteAccountModal, useErrorModal } from '../../hooks/useModalStates'
import ErrorModal from "../ErrorModal";
import DeleteAccountModal from "./DeleteAccountModal";


export const SettingsPage = () => {

    const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({isTimeout:true});
    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});
    const { showErrorModal, hideErrorModal, openErrorModal, showErrorTitle, showErrorText } = useErrorModal();

    const { showDeleteAccountModal, hideDeleteAccountModal, openDeleteAccountModal } = useDeleteAccountModal();


    return (
        <div className='min-vh-100 d-flex flex-column'>
            <Header />
            <MainContent openErrorAlert={openErrorAlert} openErrorModal={openErrorModal} openEventAlert={openEventAlert}
                openDeleteAccountModal={openDeleteAccountModal}/>
            <Footer showEventAlert={showEventAlert} hideEventAlert={hideEventAlert} eventText={eventText} 
                showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>

            <ErrorModal showErrorModal={showErrorModal} hideErrorModal={hideErrorModal} showErrorText={showErrorText} showErrorTitle={showErrorTitle}/>
            <DeleteAccountModal show={showDeleteAccountModal} onHide={hideDeleteAccountModal} />
        </div>
    )
};

export default SettingsPage;