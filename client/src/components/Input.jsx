import React from "react";
import { Form } from "react-bootstrap";

/* <Form className>
    <Form.Control id="passwordInput" className='border border-primary' type='password'></Form.Control>
</Form>

<p>Service Name: <input id='serviceInput' onChange={handleServiceNameChange} value={currentServiceName}></input></p> */


export const Input = ({formClassName="", formControlId,
    formControlClassName="", placeholder="", type="text", onChange, value}) => {
    return (
        <Form className={formClassName}>
            <Form.Control id={formControlId} className={formControlClassName} type={type} onChange={onChange} value={value} 
                placeholder={placeholder}/>
        </Form>
    )
}