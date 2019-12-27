import App from './App';
import { ExportMicrofrontend } from 'react-microfrontend';
import schema from './lib/schema';

ExportMicrofrontend({
	...schema,
	view: {
		App
	}
});
