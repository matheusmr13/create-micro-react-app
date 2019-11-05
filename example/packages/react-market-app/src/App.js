import React from 'react';
// import MessageWorker from 'react-market-base';

// import useMessageWorker from './useWorker';

import './App.css';

// import importScript from './import-script';

// const messageWorker = new MessageWorker('TEST');

const App = ({ microfrontends }) => {
  // const { message } = useMessageWorker(messageWorker);
  const microfrontendKeyList = Object.keys(microfrontends);

  return (
    <div className="App">
      <h1>Welcome to Markety</h1>
      {/* <h2>{message}</h2> */}

      <div className="App__menu">
        {
          microfrontendKeyList.length > 0 && microfrontendKeyList.map((microfrontendKey) => {
            const { content: MicrofrontendComponent } = microfrontends[microfrontendKey];

            return (
              <div className="App_microfrontend-container" key={microfrontendKey}>
                {/* <MicrofrontendComponent test={{ TESTY: 'ABELHA' }} messageWorker={messageWorker} /> */}
                <MicrofrontendComponent test={{ TESTY: 'ABELHA' }}/>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default App;
