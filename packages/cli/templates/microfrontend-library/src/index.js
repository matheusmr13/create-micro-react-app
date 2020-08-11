import { ExportMicrofrontend } from 'react-microfrontend';
import schema from './lib/schema';
import App from './App';

ExportMicrofrontend({
  ...schema,
  view: App,
});
