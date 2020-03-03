import React from 'react';
export default {
  name: 'my-micro',
  interface: {
    myProp: {}
  },
	view: {
    myView: () => <span className="microfrontend">micro-content</span>
  },
};
