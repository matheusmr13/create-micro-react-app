import { ExportMicrofrontend } from 'react-microfrontend';
import schema from './lib/schema';
import App from './App';

ExportMicrofrontend({
  ...schema,
  view: App,
  name: 'microfrontend',
  definition: {
    type: TYPE.ROUTING,
    url: '/orders',
    label: 'Orders',
  },
});
