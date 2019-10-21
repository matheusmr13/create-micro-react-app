import React from 'react';
import logo from './logo.svg';
import Helmet from 'react-helmet'
import './App.css';

import microfrontends from './microfrontend.json';
import importScript from './import-script';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Helmet>
        { Object.keys(microfrontends).map(moduleName => [
            <script>{importScript(moduleName)}</script>,
            microfrontends[moduleName].map(url => <script key={url} src={url}  type="text/javascript"></script>)
          ]
        )
        }
      </Helmet>
    </div>
  );
}

export default App;
