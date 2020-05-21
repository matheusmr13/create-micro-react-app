import { ExportMicrofrontend, TYPE } from 'react-microfrontend';
import schema from './lib/internal';
import CartWidget from './CartWidget';
import CartScreen from './CartScreen';

ExportMicrofrontend({
  ...schema,
  view: {
    CartWidget,
    CartScreen,
  },
});
