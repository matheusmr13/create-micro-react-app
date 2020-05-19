import { ExportMicrofrontend, TYPE } from 'react-microfrontend';
import schema from './lib/schema';
import Showcase from './Showcase';

ExportMicrofrontend({
  ...schema,
  view: Showcase,
});
