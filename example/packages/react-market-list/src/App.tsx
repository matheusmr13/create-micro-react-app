import React, { FunctionComponent } from 'react';
import MessageWorker from 'react-market-base';

import useMessageWorker from './useWorker';

import './App.css';

const messageWorker = new MessageWorker('AAA');

const App = () => {
  const { message } = useMessageWorker(messageWorker);

  return (
    <div className="App">
      <header className="App-header">
        <h1>THIS IS THE LIST</h1>
        <h1>{`Message sent via worker: ${message}`}</h1>
      </header>
    </div>
  );
}

export default App;
