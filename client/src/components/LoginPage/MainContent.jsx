import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Input } from "../Input";
import "./MainContent.css"

const MainContent = ({ handleLogin }) => {

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Row className="w-100">
                <Col xs={4} sm={3} lg={{span:1, offset:4}} className="ps-lg-1">
                    <p>Username (Email): </p>
                </Col>
                <Col xs={7} lg={3} className='ps-0'>
                    <Input formControlId={'usernameInput'} formControlClassName={'border border-primary'}/>
                </Col>
            </Row>
            <Row className="w-100 mb-4 mb-sm-3">
                <Col xs={4} sm={3} lg={{span:1, offset:4}} className="ps-lg-1">
                    <p>Password: </p>
                </Col>
                <Col xs={7} lg={3} className='ps-0'>
                    <Input formControlId={'passwordInput'} formControlClassName='border border-primary' type='password'/>
                </Col>
            </Row>
            <Row className="w-100 mb-5">
                <Col xs={11} sm={{span:9, offset:1}} lg={{span:4, offset:4}} className="d-flex justify-content-end">
                    <Link className="register-link link-primary ps-4 ps-lg-0" to="/registration"> Don't have an account? Click here to register!</Link>
                    <Button className="ms-4" onClick={() => handleLogin({
                        username: document.getElementById('usernameInput').value,
                        password: document.getElementById('passwordInput').value
                    })}>Login</Button>
                </Col>
                
            </Row>

        </Container>
            
    )
}

export default MainContent;