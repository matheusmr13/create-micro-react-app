import React from 'react';
import './App.css';

import calculator from 'calculator';

const CalculatorClient = calculator.api;

console.info(CalculatorClient)
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
    CalculatorClient.callScheduleResetValue().then((myResult) => {
      console.info('apagou mesmo ein', myResult);
    });
  }

  render() {
    return (
      <div className="MyAnotherMicrofrontend">
        {this.state.result}
        |||
        <button onClick={this.handleClick}>APAGAR TUDO JAJA</button>
      </div>
    );
  }
}

export default App;
