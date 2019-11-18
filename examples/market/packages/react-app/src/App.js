import React from 'react';

import { withMicrofrontend } from 'react-microfrontend';

import './App.css';

// import importScript from './import-script';

const App = ({ microfrontends, microfrontend }) => {
  console.log({ microfrontends, microfrontend })

  if (!microfrontends || !microfrontend) {
    return <div>APPY VAZIO</div>
  }

  const microFrontsKeysList = Object.keys(microfrontends).sort();

  return (
    <div className="App">
      <div className="App__title">
      {process.env.REACT_APP_MY_COOL_ENV_FILE_TITLE} - {process.env.REACT_APP_MY_COOL_ENV_TITLE}
      </div>
      <h1>React Market example</h1>
      <div className="App__menu">
        {
          microFrontsKeysList.length > 0 && microFrontsKeysList.map((key) => {
            const { content: MicrofrontendComponent } = microfrontends[key];

            return <MicrofrontendComponent key={key} />
          })
        }
      </div>
    </div>
  );
}

export default withMicrofrontend(App, { microfrontendKey: 'react-market-cart' });
