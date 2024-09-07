import React from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap";


const MainContent = () => {
    return (
        <Form className="w-100 pt-md-3">
            <Container fluid className="d-flex h-100 flex-column pt-5">

                <Row className>
                    <Col md={{offset:5, span:2}}>
                        <p>Username:</p>
                    </Col>
                </Row>
                <Row className="mb-3 mb-md-5">
                    <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                        <Form.Group>
                            <Form.Control className="border border-primary" placeholder="Enter new username">
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>


                <Row className>
                    <Col md={{offset:5, span:2}}>
                        <p>Password:</p>
                    </Col>
                </Row>
                <Row className="mb-2 mb-md-3">
                    <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                        <Form.Group>
                            <Form.Control className="border border-primary" placeholder="Enter old password">
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-2 mb-md-3">
                    <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                        <Form.Group>
                            <Form.Control className="border border-primary" placeholder="Enter new password">
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col xs={{offset:1, span:10}} sm={{offset:2, span:8}} md={{offset:4, span:4}}>
                        <Form.Group>
                            <Form.Control className="border border-primary" placeholder="Re-enter new password">
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={{offset:3, span:6}} md={{offset:4, span:4}} className="mb-3 mb-md-5">
                        <Button>Save Changes</Button>
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