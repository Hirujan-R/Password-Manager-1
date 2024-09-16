import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { editEmail, editUserPassword, getEmail } from "../../utils/apiUtils";
import './MainContent.css';


const MainContent = ({openErrorAlert, openErrorModal, openEventAlert, openDeleteAccountModal}) => {

    const { control ,handleSubmit, formState: { errors }, getValues, reset } = useForm();
    // State management for emails
    const [email, setEmail] = useState('');

    useEffect(() => {
        // When page first loads, get current email
        async function fetchEmail() {
            setEmail(await getEmail({openErrorAlert,openErrorModal}));
        }
        fetchEmail();
        
    }, []);

    useEffect(() => {
        // When value of email changes, reset input field to contain the new value of email
        if (email) {
            reset({email:email});
        }
    }, [email, reset]);


    const onSubmit = async (data) => {
        if (data.email !== '' && data.email !== email) {
            // Call edit email API function if value of email input field isn't empty and is different to current value of email
            await editEmail({newEmail: data.email, openErrorAlert, openEventAlert, openErrorModal, setEmail});
        }
        if (data.oldPassword !== '' && data.newPassword !== '') {
            /*Call edit user password API function if value of password input field isn't empty
             and is different to current value of password*/
            await editUserPassword({oldPassword: data.oldPassword, newPassword: data.newPassword, openErrorAlert, openEventAlert, openErrorModal});
        }
        
    }

    return (
        <Form className="w-100 pt-md-3" onSubmit={handleSubmit(onSubmit)}>
            <Container fluid className="main-content d-flex h-100 flex-column pt-5">
                <Row className>
                    <Col md={{offset:5, span:2}}>
                        <p>Email:</p>
                    </Col>
                </Row>
                {/*Email input field*/}
                <Form.Group>
                    <Row className="mb-3 mb-md-5">
                        <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue={email} // Displays current value of email
                                rules={{
                                    required: 'Email is required', // Value is required in input field
                                    pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email address
                                    message: 'Invalid email address'}
                                }}
                                render={({ field}) => (
                                    <Form.Control className="input-field" placeholder="Enter new email"
                                        isInvalid={!!errors.email} {...field} />
                                )}
                            />
                            {errors.email && <Form.Control.Feedback className="mb-0" type="invalid">{errors.email.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>


                <Row className>
                    <Col md={{offset:5, span:2}}>
                        <p>Password:</p>
                    </Col>
                </Row>
                {/*Old password input field*/}
                <Form.Group>
                    <Row className="mb-2 mb-md-3">
                        <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                            <Controller
                                name="oldPassword"
                                control={control}
                                defaultValue=''
                                rules={{}}
                                render={({ field}) => (
                                    <Form.Control className="input-field" placeholder="Enter old password" type="password"
                                        isInvalid={!!errors.oldPassword} {...field} />
                                )}
                            />
                            {errors.oldPassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.oldPassword.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                {/*New password input field*/}
                <Form.Group>
                    <Row className="mb-2 mb-md-3">
                        <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                            <Controller
                                name="newPassword"
                                control={control}
                                defaultValue=''
                                rules={{
                                    validate: {
                                        noEmptyOldPassword: (value) => value === '' || getValues('oldPassword') !== '' || 'Old Password field cannot be empty', 
                                        // Ensures input field isn't empty and oldPassword input field isn't empty
                                        notOldPassword: (value) => value === '' || value !== getValues('oldPassword') || 'New Password must be different from current password'
                                        // Ensures new password doesn't have same value as old password
                                    }
                                }}
                                render={({field}) => (
                                    <Form.Control className="input-field" placeholder="Enter new password" type="password"
                                        isInvalid={!!errors.newPassword} {...field} />
                                )}
                            />
                            {errors.newPassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.newPassword.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                {/*Retype password input field*/}
                <Form.Group>
                    <Row className="mb-5">
                        <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                            <Controller
                                name="retypePassword"
                                control={control}
                                defaultValue=''
                                rules={{
                                    validate: {
                                        noEmptyNewPassword: (value) => value === '' || getValues('newPassword') !== '' || 'New Password field cannot be empty', 
                                        // Ensures value of input field or new password input field isn't empty
                                        matchNewPassword: (value) => value === getValues('newPassword') || "Passwords don't match"
                                        // Ensures value of input field is equal to value of new password input field
                                    }
                                }}
                                render={({field}) => (
                                    <Form.Control className="input-field" placeholder="Re-type new password" type="password"
                                        isInvalid={!!errors.retypePassword} {...field} />
                                )}
                            />
                            {errors.retypePassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.retypePassword.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                    
                <Row>
                    <Col xs={{offset:3, span:6}} md={{offset:4, span:4}} className="mb-3 mb-md-4">
                        {/*Save Changes button that calls onSubmit*/}
                        <Button className="primary-button" type="submit">Save Changes</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{offset:3, span:6}} md={{offset:5, span:2}}>
                        {/*Delete Account button that opens DeleteAccountModal*/}
                        <Button onClick={openDeleteAccountModal} className="danger-button">Delete Account</Button>
                    </Col>
                </Row>
                
            </Container>
        </Form>
    );
}

export default MainContent;