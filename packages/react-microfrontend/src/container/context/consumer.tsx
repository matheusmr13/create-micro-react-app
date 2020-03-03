import React from 'react';
import MicrofrontendContext from './index';

const { Consumer: MicrofrontendContextConsumer } = MicrofrontendContext;

interface withMicrofrontendOptions {
  microfrontendKey: string
}

export default (WrappedComponent, { microfrontendKey }: withMicrofrontendOptions) =>
(props) => (
  <MicrofrontendContextConsumer>
    {microfrontends => (<WrappedComponent
          {...props}
          microfrontends={microfrontends}
          microfrontend={microfrontends[microfrontendKey]}
        />
      )
    }
  </MicrofrontendContextConsumer>
);
