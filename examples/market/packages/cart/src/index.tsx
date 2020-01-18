import Cart from './pages/Cart';
import Widget from './pages/Widget';

import schema from './lib/schema';
import { ExportMicrofrontend } from 'react-microfrontend';

ExportMicrofrontend({
  ...schema,
	view: {
    Cart,
    Widget
  },
});
