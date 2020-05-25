import { ExportMicrofrontend, TYPE } from 'react-microfrontend';
import schema from './lib/internal';
import Showcase from './Showcase';

ExportMicrofrontend({
  ...schema,
  view: Showcase,
});
