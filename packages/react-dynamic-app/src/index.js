import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

window.__my_test__  =  window.__my_test__ || {};

window.__my_test__.reactDynamicModule = () => {
	console.info('react-dynamic');
}