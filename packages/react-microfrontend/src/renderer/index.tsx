import React from 'react';
import RoutingRenderer from './route';
import Api from '../api';

import MICRO_TYPE from './type';

class MicrofrontendRenderer extends React.Component<{
  microfrontends: { [key : string] : Api; },
  type ?: MICRO_TYPE
  children ?: string
}> {
  render() {
    const { type = MICRO_TYPE.DEFAULT, children, microfrontends } = this.props;
    const options = {
      [MICRO_TYPE.ROUTING]: () => <RoutingRenderer microfrontends={Object.values(microfrontends).filter(m => m.hasType(MICRO_TYPE.ROUTING))} />,
      [MICRO_TYPE.DEFAULT]: () => undefined,
    };
    let a = options[type]();

    console.info('aque', options, type, children, a);
    return a;
  }
}

export default MicrofrontendRenderer;
