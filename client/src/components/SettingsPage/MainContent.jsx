import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { editEmail, editUserPassword, getEmail } from "../../utils/apiUtils";


const MainContent = ({openErrorAlert, openErrorModal, openEventAlert}) => {

    const { control ,handleSubmit, formState: { errors }, getValues, reset } = useForm();
    const [email, setEmail] = useState('');

    useEffect(() => {
        async function fetchEmail() {
            setEmail(await getEmail({openErrorAlert,openErrorModal}));
        }
        fetchEmail();
        
    },[openErrorAlert, openErrorModal]);

    useEffect(() => {
        if (email) {
            reset({email:email});
        }
    }, [email, reset]);


    const onSubmit = async (data) => {
        if (data.email !== '' && data.email !== email) {
            await editEmail({newEmail:data.email, openErrorAlert, openEventAlert, openErrorModal, setEmail});
        }
        if (data.oldPassword !== '' && data.newPassword !== '') {
            await editUserPassword({oldPassword:data.oldPassword, newPassword:data.newPassword, openErrorAlert, openEventAlert, openErrorModal});
        }
        
    }

    return (
        <Form className="w-100 pt-md-3" onSubmit={handleSubmit(onSubmit)}>
            <Container fluid className="d-flex h-100 flex-column pt-5">
                <Row className>
                    <Col md={{offset:5, span:2}}>
                        <p>Email:</p>
                    </Col>
                </Row>
                <Form.Group>
                    <Row className="mb-3 mb-md-5">
                        <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue={email}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address'}
                                }}
                                render={({ field}) => (
                                    <Form.Control className="border border-primary" placeholder="Enter new email"
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
                <Form.Group>
                    <Row className="mb-2 mb-md-3">
                        <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                            <Controller
                                name="oldPassword"
                                control={control}
                                defaultValue=''
                                rules={{}}
                                render={({ field}) => (
                                    <Form.Control className="border border-primary" placeholder="Enter old password" type="password"
                                        isInvalid={!!errors.oldPassword} {...field} />
                                )}
                            />
                            {errors.oldPassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.oldPassword.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
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
                                        notOldPassword: (value) => value === '' || value !== getValues('oldPassword') || 'New Password must be different from current password'
                                    }
                                }}
                                render={({ field}) => (
                                    <Form.Control className="border border-primary" placeholder="Enter new password" type="password"
                                        isInvalid={!!errors.newPassword} {...field} />
                                )}
                            />
                            {errors.newPassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.newPassword.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
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
                                        matchNewPassword: (value) => value === getValues('newPassword') || "Passwords don't match"
                                    }
                                }}
                                render={({field}) => (
                                    <Form.Control className="border border-primary" placeholder="Re-type new password" type="password"
                                        isInvalid={!!errors.retypePassword} {...field} />
                                )}
                            />
                            {errors.retypePassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.retypePassword.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                    
                <Row>
                    <Col xs={{offset:3, span:6}} md={{offset:4, span:4}} className="mb-3 mb-md-4">
                        <Button type="submit">Save Changes</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button xs={{offset:3, span:6}} md={{offset:5, span:2}} variant="danger">Delete Account</Button>
                    </Col>
                </Row>
                
            </Container>
        </Form>
    );
}

export default MainContent;