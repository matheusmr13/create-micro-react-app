import { ExportMicrofrontend } from 'react-microfrontend';
import schema from './lib/schema';

import Button from './components/button';
import Card from './components/button';

ExportMicrofrontend({
  ...schema,
  view: { Button, Card },
});
