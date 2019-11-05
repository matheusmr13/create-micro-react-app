import React, { useState, FunctionComponent } from 'react';
import logo from './logo.svg';
import './App.css';

interface FormProps {
  messageWorker: any
}
let inputValue = '';
const FormComponent: FunctionComponent<FormProps> = ({ messageWorker }) => {
  // const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e) => {
    const value = e.target.value;

    inputValue = value;
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();

    messageWorker.sendMessage(inputValue);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" onChange={handleInputChange}/>
    </form>
  );
}

export default FormComponent;
