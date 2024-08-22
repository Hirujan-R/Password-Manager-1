import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { Input } from "../Input";
import "./MainContent.css";


const MainContent = ({handleRegistration}) => {
    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Row className="w-100">
                <Col xs={5} sm={4} lg={{span:3, offset:2}} className="text-sm-end">
                    <p>Enter Username (Email): </p>
                </Col>
                <Col xs={7} lg={3} className=''>
                    <Input formControlId={'usernameInput'} formControlClassName={'border border-primary'}/>
                </Col>
            </Row>



            <Row className="w-100">
                <Col xs={5} sm={4} lg={{span:3, offset:2}} className="text-sm-end">
                    <p>Enter Password: </p>
                </Col>
                <Col xs={7} lg={3} className=''>
                    <Input formControlId={'passwordInput'} formControlClassName='border border-primary' type='password'/>
                </Col>
            </Row>


            <Row className="w-100">
                <Col xs={5} sm={4} lg={{span:3, offset:2}} className="text-sm-end">
                    <p>Re-enter Password: </p>
                </Col>
                <Col xs={7} lg={3} className=''>
                    <Input formControlId={'checkPasswordInput'} formControlClassName='border border-primary' type='password'/>
                </Col>
            </Row>


            <Row className="w-100">
                <Col xs={12} sm={{span:9, offset:2}} lg={{span:4, offset:4}} className="d-flex justify-content-end">
                    <a href="#" className="login-link link-primary">Have an account? Click here to login!</a>
                    <Button className="ms-4" onClick={() => handleRegistration({
                        username: document.getElementById('usernameInput').value,
                        password: document.getElementById('passwordInput').value,
                        checkPassword: document.getElementById('checkPasswordInput').value
                    })}>Register</Button>
                </Col>
                
            </Row>
        </Container>
    )
}

export default MainContent;