import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { getEmail } from "../../utils/apiUtils";


const MainContent = ({openErrorAlert, openErrorModal}) => {

    const { control ,handleSubmit, formState: { errors }, getValues, reset } = useForm();
    const [email, setEmail] = useState('');

    const onSubmit = (data) => {
        console.log(data);
    }

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
                                rules={{pattern: {
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
                                name="password"
                                control={control}
                                defaultValue=''
                                rules={{pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid password'}
                                }}
                                render={({ field}) => (
                                    <Form.Control className="border border-primary" placeholder="Enter old password" type="password"
                                        isInvalid={!!errors.password} {...field} />
                                )}
                            />
                            {errors.password && <Form.Control.Feedback className="mb-0" type="invalid">{errors.password.message}</Form.Control.Feedback>}
                        </Col>
                    </Row>
                </Form.Group>
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