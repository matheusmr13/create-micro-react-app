import { ExportMicrofrontend, TYPE } from 'react-microfrontend';
import Promotion from './Promotion';

ExportMicrofrontend({
  name: 'promotions',
  view: Promotion,
});
