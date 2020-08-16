import { ExportMicrofrontend } from '@cmra/react';
import schema from './lib/schema';
import App from './App';

ExportMicrofrontend({
  ...schema,
  view: App,
});
