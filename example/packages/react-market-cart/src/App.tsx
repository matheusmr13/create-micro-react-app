import React from 'react';
import MessageWorker from 'react-market-base';

import FormComponent from './form';

import logo from './logo.svg';
import './App.css';

interface AppProps {
  test: any,
  messageWorker: any
}

const messageWorker = new MessageWorker('TEST');

const App: React.FC<AppProps> = ({ test }) => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.AAAAA</code> and save to reload.
        </p>
        <FormComponent messageWorker={messageWorker} />
      </header>
    </div>
  );
}

App.defaultProps = {
  test: {}
}

export default App;
