import React from 'react';
import logo from './logo.svg';
import './App.css';

import calculator from 'calculator';

const CalculatorClient = calculator.api;

class App extends React.Component {
  state = {
    result: 0
  }

  componentDidMount() {
    CalculatorClient.onValueChange((newResult) => {
      this.setState({ result: newResult });
    });
  }

  handleClick = () => {
    CalculatorClient.triggerResetValue();
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
