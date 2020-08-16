import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ImportMicrofrontend } from '@cmra/react';
import App from './App';

ReactDOM.render(
  <ImportMicrofrontend>
    <App />
  </ImportMicrofrontend>,
  document.getElementById('root')
);
