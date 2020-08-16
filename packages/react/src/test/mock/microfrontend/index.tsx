import React from 'react';
import schema from './schema';
import api from './lib';
export default {
  ...schema,
  view: {
    myView: () => <div>
      <span className="microfrontend">micro-content</span>
      <span className="microfrontend-value">{api.getMyProp()}</span>
      <button className="microfrontend-button" onClick={() => api.setMyProp('asd')}>mybutton</button>
    </div>
  },
};
