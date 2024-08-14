import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Nav } from "react-bootstrap";
import './LoginPage.css'

export const LoginPage = () => {

    const handleLogin = ({username, password}) => {
        console.log(username);
        console.log(password);
    }

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100 ">
            <Row className="w-100 mb-0">
                <Col xs={{span:1, offset:4}}>
                    <p>Username (Email): </p>
                </Col>
                <Col xs={3}>
                    <Form className>
                        <Form.Control id="usernameInput" className='border border-primary' type='text'></Form.Control>
                    </Form>
                </Col>
            </Row>
            <Row className="w-100 mb-3">
                <Col xs={{span:1, offset:4}}>
                    <p>Password: </p>
                </Col>
                <Col xs={3}>
                    <Form className>
                        <Form.Control id="passwordInput" className='border border-primary' type='password'></Form.Control>
                    </Form>
                </Col>
            </Row>
            <Row className="w-100 mb-5">
                <Col xs={{span:5, offset:3}} className="d-flex justify-content-end">
                    <a href="#" className="register-link link-primary">Don't have an account? Click here to register!</a>
                    <Button className="ms-4" onClick={() => handleLogin({
                        username: document.getElementById('usernameInput').value,
                        password: document.getElementById('passwordInput').value
                    })}>Login</Button>
                </Col>
                
            </Row>



        </Container>
            
    )
}