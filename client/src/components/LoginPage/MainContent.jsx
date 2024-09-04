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
        if ( await login({email:data.email, password:data.password, openErrorAlert}) === true ) {
            navigate('/main');
        }
    }

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{span:4, offset:4}}>
                            <Controller 
                                name='email'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid Email Address'
                                    }
                                }}
                                render={({field}) => (
                                    <Form.Control className='border border-primary' type="text" placeholder="Email"
                                        isInvalid={!!errors.email} {...field}/>
                                )}
                            />
                            {errors.email && <Form.Control.Feedback className="mb-0" type="invalid">{errors.email.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-4 mb-lg-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{span:4, offset:4}}>
                            <Controller
                                name='password'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: 'Password is required'
                                }}
                                render={({field}) => (
                                    <Form.Control className='border border-primary' type="password" placeholder="Password"
                                        isInvalid={!!errors.password} {...field}/>
                                )}

                            />
                            {errors.password && <Form.Control.Feedback className="mb-0" type="invalid">{errors.password.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                <Row className="w-100 mx-auto">
                    <Col xs={12} sm={{span:10, offset:1}} md={{offset:2, span:8}} lg={{span:4, offset:4}} className="d-flex justify-content-end align-items-center">
                        <Link className="register-link link-primary mb-0" to="/registration"> Don't have an account? Click here to register!</Link>
                        <Button className="ms-3" type="submit">Login</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
            
    )
}

export default MainContent;