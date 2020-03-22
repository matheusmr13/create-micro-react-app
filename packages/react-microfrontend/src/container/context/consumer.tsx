import React from 'react';
import MicrofrontendContext from './index';

const { Consumer: MicrofrontendContextConsumer } = MicrofrontendContext;

interface withMicrofrontendOptions {
  microfrontendKey ?: string
}

export default (WrappedComponent, opts : withMicrofrontendOptions = {}) => (props) => (
  <MicrofrontendContextConsumer>
    {microfrontends => (<WrappedComponent
          {...props}
          microfrontends={microfrontends}
          {...(opts.microfrontendKey ? { microfrontend: microfrontends[opts.microfrontendKey].api } : {})}
        />
      )
    }
  </MicrofrontendContextConsumer>
);
