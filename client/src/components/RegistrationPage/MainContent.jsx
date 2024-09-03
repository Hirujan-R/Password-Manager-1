import React from "react";
import { Row, Col, Button, Container, Form } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { addUser } from "../../utils/apiUtils";
import { Input } from "../Input";
import "./MainContent.css";
import { Link } from "react-router-dom";


const MainContent = ({openErrorAlert, openEventAlert}) => {

    const { control, handleSubmit, formState: { errors }, getValues } = useForm();

    const onSubmit = (data) => {
        addUser({email: data.email, password: data.password, openErrorAlert, openEventAlert});
    }

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Row className="w-100">
                        <Col xs={{offset:4, span:4}}>
                            <Controller
                                name='email'
                                control={control}
                                defaultValue=""
                                rules={{ 
                                    required: 'Email is required',
                                    pattern: {
                                        value:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address'
                                    }
                                }}
                                render={({ field }) => (
                                    <Form.Control className="border border-primary" type="text" placeholder="Email" 
                                        isInvalid={!!errors.email} {...field}/>
                                )}
                            />
                            {errors.email && <Form.Control.Feedback className="mb-0" type="invalid">{errors.email.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                    
                </Form.Group>

                <Form.Group className="mb-3">
                    <Row className="w-100">
                        <Col xs={{offset:4, span:4}}>
                            <Controller
                                name='password'
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Password is required' }}
                                render={({ field }) => (
                                    <Form.Control className="border border-primary" type="password" placeholder="Password" 
                                        isInvalid={errors.password} {...field}/>
                                )}
                            />
                            {errors.password && <Form.Control.Feedback className="mb-0" type="invalid">{errors.password.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Row className="w-100">
                        <Col xs={{offset:4, span:4}}>
                            <Controller
                                name='retypepassword'
                                control={control}
                                defaultValue=""
                                rules={{ 
                                    required: "Please retype your password",
                                    validate: value => value === getValues('password') || "Passwords don't match"
                                }}
                                render={({ field }) => (
                                    <Form.Control className="border border-primary" type="password" placeholder="Retype Password" 
                                        isInvalid={errors.retypepassword} {...field}/>
                                )}
                            />
                            {errors.retypepassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.retypepassword.message}</Form.Control.Feedback>}

                        </Col>
                    </Row>
                </Form.Group>
                <Row className="w-100">
                    <Col xs={{span:4,offset:4}} className="d-flex justify-content-end align-items-center" >
                        <Link className="register-link link-primary" to="/registration"> Have an account? Click here to login!</Link>
                        <Button className="ms-3" type="submit">Register</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default MainContent;