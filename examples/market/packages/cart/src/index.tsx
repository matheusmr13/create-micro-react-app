// import App from './App';
import Widget from './Widget';
import schema from './lib/schema';
import { ExportMicrofrontend } from 'react-microfrontend';

ExportMicrofrontend({
  ...schema,
	view: {
    // App,
    Widget
  },
});
