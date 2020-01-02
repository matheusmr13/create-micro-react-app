import QuickCart from './QuickCart';

import schema from './lib/schema';
import { ExportMicrofrontend } from 'react-microfrontend';

ExportMicrofrontend({
  ...schema,
	view: {
    QuickCart
  },
});
