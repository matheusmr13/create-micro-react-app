import { ExportMicrofrontend } from 'react-microfrontend';
import schema from './lib/internal';

import Button from './components/Button';

ExportMicrofrontend({
  ...schema,
  view: { Button },
});
