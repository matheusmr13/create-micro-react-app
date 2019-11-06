import React, { FunctionComponent, useState, useEffect } from 'react';
// import { EventManager } from 'microfrontend-controller';
import EventManager from 'react-market-base';

// import useMessageWorker from './useWorker';

declare global {
  interface Window { BLA: EventManager }
}

import './App.css';

const eventManager = new EventManager('Abelha');

window.BLA = eventManager;
const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        <h1>THIS IS THE LIST</h1>
        {/* <h1>{`Message sent via worker: ${message}`}</h1> */}
      </header>
    </div>
  );
}

export default App;
