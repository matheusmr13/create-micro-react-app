import React from 'react';
import logo from './logo.svg';
import './App.css';

import CalculatorClient from 'calculator';


class App extends React.Component {
  state = {
    result: 0
  }

  componentDidMount() {
    CalculatorClient.subscribeToValue((newResult) => {
      this.setState({ result: newResult });
    });
  }

  handleClick = () => {
    CalculatorClient.resetValue();
  }

  render() {
    return (
      <div className="MyAnotherMicrofrontend">
        {this.state.result}
        |||
        <button onClick={this.handleClick}>APAGAR TUDO</button>
      </div>
    );
  }
}

export default App;
