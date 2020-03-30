import { ExportMicrofrontend, TYPE } from 'react-microfrontend';
import App from './App';

ExportMicrofrontend({
  name: 'microfrontend',
  view: App,
  definition: {
    type: TYPE.ROUTING,
    url: '/hue',
    label: 'KOKO'
  }
});
