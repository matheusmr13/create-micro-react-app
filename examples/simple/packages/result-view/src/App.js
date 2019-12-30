import React from 'react';
import './App.css';

import calculator from 'calculator';
import clock from 'clock';

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ` + day + ' ' + monthNames[monthIndex] + ' ' + year;
}

class App extends React.Component {
  state = {
    result: 0,
    clock: clock.getCurrentTime()
  }

  componentDidMount() {
    calculator.onValueChange((newResult) => {
      this.setState({ result: newResult });
    });
    clock.onCurrentTimeChange((newClock) => {
      this.setState({ clock: newClock });
    });
  }

  handleClick = () => {
    calculator.callScheduleResetValue();
  }

  render() {
    return (
      <div className="MyAnotherMicrofrontend">
        {this.state.result}
        |||
        <button onClick={this.handleClick}>APAGAR TUDO JAJA</button>
        |||
        Agora é: {formatDate(this.state.clock)}
      </div>
    );
  }
}

export default App;
