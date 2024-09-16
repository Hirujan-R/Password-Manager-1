import React from "react";
import { Row, Col, Button, Container, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/apiUtils";
import "./MainContent.css"

const MainContent = ({ openErrorAlert }) => {

    const { control, handleSubmit, formState: { errors }, getValues } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Attempts to login when user clicks login by calling api function
        if ( await login({email: data.email, password: data.password, openErrorAlert}) === true ) {
            // Navigate to main page if user successfully login
            navigate('/main');
        }
    }

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                {/* Email input field */}
                <Form.Group className="mb-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{span:4, offset:4}}>
                            <Controller 
                                name='email'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: 'Email is required', // Value required in input field
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email address
                                        message: 'Invalid Email Address'
                                    }
                                }}
                                render={({field}) => (
                                    <Form.Control className='input-field' type="text" placeholder="Email"
                                        isInvalid={!!errors.email} {...field}/>
                                )}
                            />
                            {errors.email && <Form.Control.Feedback className="input-field-feedback mb-0" type="invalid">{errors.email.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                {/* Password input field */}
                </Form.Group>
                <Form.Group className="mb-4 mb-lg-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{span:4, offset:4}}>
                            <Controller
                                name='password'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: 'Password is required' // Value required in input field
                                }}
                                render={({field}) => (
                                    <Form.Control className='input-field' type="password" placeholder="Password"
                                        isInvalid={!!errors.password} {...field}/>
                                )}

                            />
                            {errors.password && <Form.Control.Feedback className="input-field-feedback mb-0" type="invalid">{errors.password.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                <Row className="w-100 mx-auto">
                    <Col xs={12} sm={{span:10, offset:1}} md={{offset:2, span:8}} lg={{span:4, offset:4}} className="d-flex justify-content-end align-items-center">
                        {/* Link to registration page */}
                        <Link className="hyperlink link-primary mb-0" to="/registration"> Don't have an account? Click here to register!</Link>
                        {/* Login button */}
                        <Button className="primary-button ms-3" type="submit">Login</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
            
    )
}

export default MainContent;