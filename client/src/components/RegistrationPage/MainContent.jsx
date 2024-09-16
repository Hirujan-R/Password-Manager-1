import React from "react";
import { Row, Col, Button, Container, Form } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { addUser } from "../../utils/apiUtils";
import { Link } from "react-router-dom";
import './MainContent.css';


const MainContent = ({openErrorAlert, openEventAlert}) => {

    const { control, handleSubmit, formState: { errors }, getValues } = useForm();

    const onSubmit = (data) => {
        // Calls add user API function when register button is clicked
        addUser({email: data.email, password: data.password, openErrorAlert, openEventAlert});
    }

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                {/*Email input field*/}
                <Form.Group className="mb-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{offset:4, span:4}}>
                            <Controller
                                name='email'
                                control={control}
                                defaultValue=""
                                rules={{ 
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Ensures value follows email pattern
                                        message: 'Invalid email address'
                                    }
                                }}
                                render={({ field }) => (
                                    <Form.Control className="input-field" type="text" placeholder="Email" 
                                        isInvalid={!!errors.email} {...field}/>
                                )}
                            />
                            {errors.email && <Form.Control.Feedback className="mb-0" type="invalid">{errors.email.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                    
                </Form.Group>

                {/*Password input field*/}
                <Form.Group className="mb-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{offset:4, span:4}}>
                            <Controller
                                name='password'
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Password is required' // Makes sure value is required in input field
                                }}
                                render={({ field }) => (
                                    <Form.Control className="input-field" type="password" placeholder="Password" 
                                        isInvalid={errors.password} {...field}/>
                                )}
                            />
                            {errors.password && <Form.Control.Feedback className="mb-0" type="invalid">{errors.password.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
                
                {/*Retype password input field*/}
                <Form.Group className="mb-4 mb-lg-3">
                    <Row className="w-100 mx-auto">
                        <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{offset:4, span:4}}>
                            <Controller
                                name='retypepassword'
                                control={control}
                                defaultValue=""
                                rules={{ 
                                    required: "Please retype your password", // Ensures value in input field
                                    validate: value => value === getValues('password') || "Passwords don't match"
                                    // Ensures value in input field matches value in password input field
                                }}
                                render={({ field }) => (
                                    <Form.Control className="input-field" type="password" placeholder="Retype Password" 
                                        isInvalid={errors.retypepassword} {...field}/>
                                )}
                            />
                            {errors.retypepassword && <Form.Control.Feedback className="mb-0" type="invalid">{errors.retypepassword.message}</Form.Control.Feedback>}

                        </Col>
                    </Row>
                </Form.Group>
                <Row className="w-100 mx-auto">
                    <Col xs={12} sm={{offset:1, span:10}} md={{offset:2, span:8}} lg={{offset:4, span:4}} className="d-flex justify-content-end align-items-center" >
                        {/*Link to navigate to login page*/}
                        <Link className="hyperlink link-primary mb-0" to="/"> Have an account? Click here to login!</Link>
                        {/*Submit button*/}
                        <Button className="primary-button ms-3" type="submit">Register</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default MainContent;