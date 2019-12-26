import React from 'react';
import './App.css';

import Lib from './lib-refact/new-lib';

const API = Lib.api;

class App extends React.Component {
  componentDidMount() {
    API.onResetValueTriggered(() => {
      API.setValue(0);
    });
  }

  handleClick = (value) => () => {
    API.setValue(value + API.getValue());
  }

  render() {
    return (
      <div className="MyMicrofrontend">
        <button onClick={this.handleClick(-1)}>-</button>
        <button onClick={this.handleClick(+1)}>+</button>
      </div>
    );
  }
}

export default App;
