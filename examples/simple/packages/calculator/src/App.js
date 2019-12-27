import React from 'react';
import './App.css';

import api from './lib';

class App extends React.Component {
  componentDidMount() {
    api.onResetValueTriggered(() => {
      api.setValue(0);
    });

    api.onScheduleResetValueCalled(() => new Promise((resolve) => {
      setTimeout(() => {
        api.setValue(0);
        resolve();
      }, 2000);
    }))
  }

  handleClick = (value) => () => {
    api.setValue(value + api.getValue());
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
