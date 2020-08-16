import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ImportMicrofrontend } from '@cmra/react';

ReactDOM.render(
  <ImportMicrofrontend>
    <App />
  </ImportMicrofrontend>,
  document.getElementById('root')
);
