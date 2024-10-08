import React, { useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../../Modal.jsx';
import { randomisePassword } from '../../../utils/PasswordUtils.jsx';
import './CreatePasswordModal.css';



function CreatePasswordModal({ show, onHide, handleAddPassword }) {

  const { control, handleSubmit, formState: {errors}, getValues, reset, setValue } = useForm();


  const onSubmit = (data) => {
    // Attempts to add password when create button is clicked
    handleAddPassword({newServiceName: data.service, newPassword: data.password});
  }

  useEffect(() => {
    // Reset input field values when modal closes
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
    <Container className='body-content h-100'>
      <Form>
        {/*Service name input field*/}
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
                  <Form.Control id={'serviceInput'} className={'input-field'} placeholder={'Service Name'}
                    isInvalid={!!errors.service} maxLength={20} {...field}/>
                )}
              />
              {errors.service && <Form.Control.Feedback className='mb-0' type='invalid'>{errors.service.message}</Form.Control.Feedback>}
            </Col>
          </Row>
        </Form.Group>
        {/*Service password input field*/}
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
                    <Form.Control id={'passwordInput'} className={'input-field'} placeholder={'Password'}
                      isInvalid={!!errors.password} maxLength={25} {...field}/>
                  )}
              />
              {errors.password && <Form.Control.Feedback className='mb-0' type='invalid'>{errors.password.message}</Form.Control.Feedback>}
            </Col>
            <Col xs={{span:4}} sm={3} className='d-flex justify-content-end pe-0'>
              {/*Randomise password*/}
              <Button className='p-1 primary-button' style={{height:'38px'}} onClick={() => randomisePassword(setValue,'password')}>Randomise</Button>
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
      <Row className='footer-content d-flex justify-content-end'>
        <Col className='d-flex justify-content-end pe-0 w-auto' xs={{offset:5, span:3}} sm={{offset:7, span:2}}>
          {/*Close button*/}
          <Button className='secondary-button' onClick={handleClose}>
            Close
          </Button>
        </Col>
        {/*Create button*/}
        <Col className='d-flex justify-content-end pe-0 w-auto ps-2' xs={{offset:0, span:3}} sm={{span:1}}>
          <Button className='primary-button' onClick={handleSubmit(onSubmit)}>
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