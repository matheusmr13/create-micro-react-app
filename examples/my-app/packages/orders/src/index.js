import { ExportMicrofrontend } from 'react-microfrontend';
import schema from './lib/schema';
import App from './App';

ExportMicrofrontend({
  ...schema,
  view: App,
  name: 'order',
  definition: {
    type: TYPE.ROUTING,
    url: '/orders',
    label: 'Orders',
  },
});
