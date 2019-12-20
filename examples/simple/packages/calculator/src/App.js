import React from 'react';
import logo from './logo.svg';
import './App.css';

import CalculatorDispatch from './lib/internal';


class App extends React.Component {
  count = 0

  componentDidMount() {
    CalculatorDispatch.onResetValue(() => {
      this.count = 0;
      CalculatorDispatch.changeValue(this.count);
    });
  }

  handleClick = (value) => () => {
    this.count += value;
    console.info('sending ' + this.count)
    CalculatorDispatch.changeValue(this.count);
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
