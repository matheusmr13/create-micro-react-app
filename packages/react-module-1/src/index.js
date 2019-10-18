import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));


window.__my_test__  =  window.__my_test__ || {};

window.__my_test__.reactModule1CoolFunc = () => {
	console.info('react-module-1');
}