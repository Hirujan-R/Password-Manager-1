import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from '../Modal.jsx';
import { generateRandomPassword } from '../../utils/PasswordUtils.jsx';
import './DeleteAccountModal.css';
import {useForm, Controller} from 'react-hook-form';
import { deleteUser } from '../../utils/apiUtils.jsx';

function DeleteAccountModal({ show, onHide, openErrorModal, openErrorAlert}) {
    
    const { control ,handleSubmit, formState: { errors }, getValues, reset } = useForm();

    const [deleteLine, setDeleteLine] = useState('');

    useEffect(() => {
        if (!show) {
            reset({confirmDelete:''});
        } else {
            setDeleteLine(generateRandomPassword(20));
        }
    }, [show, reset, setDeleteLine, generateRandomPassword]);
    

    

    const onSubmit = async () => {
        console.log('Hi');
        reset({confirmDelete:''}); // Reset the form
        onHide();
        await deleteUser({openErrorAlert, openErrorModal})
    };

    const modalTitle = (
      "Delete Account"
    ) 
  
    const bodyContent = (
      <div className='body-content'>
        <p className='' >Are you sure you want to delete your account? This action is irreversible. 
            To confirm deletion Enter the following line into the input field below: <br /> {deleteLine}</p>
        <Form>
            <Controller 
                name='confirmDelete'
                control={control}
                defaultValue=''
                rules={{
                    validate: {
                        matchesDeleteLine: (value) => value === deleteLine || 'The input does not match the required delete confirmation line.'
                    }
                }}
                render={({field}) => (<Form.Control className='input-field' placeholder='Enter delete confirmation line'
                    isInvalid={!!errors.confirmDelete} {...field}/>
                )}
            />
            {errors.confirmDelete && <Form.Control.Feedback className='mb-0' type='invalid'>{errors.confirmDelete.message}</Form.Control.Feedback>}
        </Form>
      </div>
    )
  
    const footerContent = (
      <div className='footer-content'>
        <Button className="secondary-button me-2" onClick={onHide}>
          Close
        </Button>
        <Button className="danger-button" onClick={handleSubmit(onSubmit)}>
          Delete
        </Button>
      </div>
      
    )
  
  
    return (
      <Modal show={show} onHide={onHide} modalTitle={modalTitle} titleClassName='w-100 text-center' bodyContent={bodyContent} footerContent={footerContent}></Modal>
    );
  };
  
  export default DeleteAccountModal;