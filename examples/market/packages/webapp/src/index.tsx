import React from 'react';
import ReactDOM from 'react-dom';
import { ImportMicrofrontend } from 'react-microfrontend';

import './index.css';
import App from './App';

ReactDOM.render((
	<ImportMicrofrontend>
		<App />
	</ImportMicrofrontend>
), document.getElementById('root'));

