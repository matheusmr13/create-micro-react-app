import React from 'react';
import logo from './logo.svg';
import './App.css';

import Api from './lib';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => Api.setOrders([...(Api.getOrders() || []), { hue: (Api.getOrders() || []).length }])}>
          +
        </button>
      </header>
    </div>
  );
}

export default App;
