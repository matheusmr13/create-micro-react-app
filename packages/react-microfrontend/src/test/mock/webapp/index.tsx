import React from 'react';
import { withMicrofrontend } from '../../../index';

const App = withMicrofrontend(({ microfrontend }) => (
  <div>
    <span className="container-app">content</span>
    { <microfrontend.api.view.myView /> }
  </div>
),{ microfrontendKey: 'my-micro' });

export default App;
