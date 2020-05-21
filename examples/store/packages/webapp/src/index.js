import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Store from './Store';
import { ImportMicrofrontend } from 'react-microfrontend';

ReactDOM.render(
  <ImportMicrofrontend>
    <Store />
  </ImportMicrofrontend>,
  document.getElementById('root')
);
