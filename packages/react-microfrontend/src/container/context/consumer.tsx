import React from 'react';
import MicrofrontendContext from './index';
import MICRO_TYPE from '../../renderer/type';
import Api from '../../api';


const { Consumer: MicrofrontendContextConsumer } = MicrofrontendContext;

interface withMicrofrontendOptions {
  microfrontendKey ?: string,
  filterByType ?: MICRO_TYPE
}

export default (WrappedComponent, opts : withMicrofrontendOptions = {}) => (props) => (
  <MicrofrontendContextConsumer>
    {(microfrontends: { [key : string] : Api; }) => {

      let microfrontendsToPass : Array<Api> | null =  null;
      const { filterByType } = opts;
      if (filterByType) {
        microfrontendsToPass = Object.values(microfrontends).filter(m => m.hasType(filterByType));
      }

      if (!microfrontendsToPass) {
        microfrontendsToPass = Object.values(microfrontends);
      }

      return (<WrappedComponent
          {...props}
          microfrontends={microfrontends}
          microfrontendsList={microfrontendsToPass}
          // Renderer={() => <MicrofrontendRenderer microfrontends={microfrontends} type={TYPE.ROUTING} />}
          {...(opts.microfrontendKey ? { microfrontend: microfrontends[opts.microfrontendKey] } : {})}
        />
      );
    }}
  </MicrofrontendContextConsumer>
);
