import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ImportMicrofrontend } from 'react-microfrontend';

ReactDOM.render((
	<ImportMicrofrontend>
		{microfrontends => <App microfrontends={microfrontends} /> }
	</ImportMicrofrontend>
), document.getElementById('root'));
