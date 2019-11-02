import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (window.registerMicrofrontend) {
	window.registerMicrofrontend('react-dynamic-app', App);
} else {
	window.parent.postMessage('LOAD', 'http://localhost:3000');

	setTimeout(() => {
		let hotReloadCss = null;
		document.querySelectorAll('script').forEach(a => {
			if (a.src.indexOf('hot-update') > -1) {
				hotReloadCss = a.src;
			}
		});
		window.parent.postMessage({ type: 'SCRIPT', payload: hotReloadCss }, 'http://localhost:3000');
		
	}, 2000)
}