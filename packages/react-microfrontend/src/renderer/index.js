import React from 'react';
import RoutingRenderer from './route';

class MicrofrontendRenderer extends React.Component {
  render() {
    const { type, children, microfrontends } = this.props;
    return ({
      ROUTING: () => <RoutingRenderer>{children}</RoutingRenderer>
    }[type] || (() => children(microfrontends)))();
  }
}

export default MicrofrontendRenderer;
