import React, { useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../../Modal.jsx';
import { randomisePassword } from '../../../utils/PasswordUtils.jsx';
import './CreatePasswordModal.css';



function CreatePasswordModal({ show, onHide, handleAddPassword }) {

  const { control, handleSubmit, formState: {errors}, getValues, reset } = useForm();


  const onSubmit = (data) => {
    handleAddPassword({newServiceName: data.service, newPassword: data.password});
  }

  useEffect(() => {
    if (!show) {
      reset({
        service: '',
        password: ''
      });
    }
  }, [show, reset]);

  const modalTitle = (
    "Create Password"
  ) 

  


  const bodyContent = (
    <Container className='h-100'>
      <Form>
        <Form.Group>
          <Row className='mb-2 mb-md-2'>
            <Col className='px-2' xs={{span:8}} sm={{offset:1, span:8}}>
              <Controller 
                name='service'
                control={control}
                defaultValue=''
                rules={{
                  required: 'Service Name is required'
                }}
                render={({field}) => (
                  <Form.Control id={'serviceInput'} className={'border border-primary'} placeholder={'Service Name'}
                    isInvalid={!!errors.service} {...field}/>
                )}
              />
              {errors.service && <Form.Control.Feedback className='mb-0' type='invalid'>{errors.service.message}</Form.Control.Feedback>}
            </Col>
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
            <Col className='px-2' xs={{span:8}} sm={{offset:1, span:8}}>
              <Controller 
                  name='password'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Password is required'
                  }}
                  render={({field}) => (
                    <Form.Control id={'passwordInput'} className={'border border-primary'} placeholder={'Password'}
                      isInvalid={!!errors.password} {...field}/>
                  )}
              />
              {errors.password && <Form.Control.Feedback className='mb-0' type='invalid'>{errors.password.message}</Form.Control.Feedback>}
            </Col>
            <Col xs={{span:4}} sm={3} className='d-flex justify-content-end pe-0'>
              <Button className='p-1' style={{height:'38px'}} onClick={() => randomisePassword('passwordInput')}>Randomise</Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </Container>
  )

  const handleClose = () => {
    onHide();
  }

  const footerContent = (
    <Container>
      <Row className='d-flex justify-content-end'>
        <Col className='d-flex justify-content-end pe-0 w-auto' xs={{offset:5, span:3}} sm={{offset:7, span:2}}>
          <Button variant='light' onClick={handleClose}>
            Close
          </Button>
        </Col>
        <Col className='d-flex justify-content-end pe-0 w-auto ps-2' xs={{offset:0, span:3}} sm={{span:1}}>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </Col>
      </Row>

    </Container>
    
    
  )


  return (
    <Modal show={show} onHide={handleClose} modalTitle={modalTitle} titleClassName='w-100 text-center' headerClassName='modal-header' footerClassName='modal-footer' bodyContent={bodyContent} footerContent={footerContent}></Modal>
  );
};

export default CreatePasswordModal;