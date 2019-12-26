import App from './App';
import { ExportMicrofrontend } from 'react-microfrontend';
import { api } from './lib-refact/new-lib';

ExportMicrofrontend(App, {
	api
});
