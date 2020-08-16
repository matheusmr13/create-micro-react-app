import React from 'react';
import { withMicrofrontend } from '../../../index';
import MicrofrontendLib from '../microfrontend/lib';

const App = withMicrofrontend(MicrofrontendLib.withMyProp(({ microfrontend, myProp }) => (
  <div>
    <span className="container-app">content</span>
    <span className="container-dom-with-microfrontend-value">{myProp}</span>
    {<microfrontend.view.myView />}
  </div>
)), { microfrontendKey: 'my-micro' });

export default App;
