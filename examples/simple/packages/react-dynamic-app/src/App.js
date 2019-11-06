import React from 'react';
import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  render() {
    return (
      <div className="MyMicrofrontend">
        {process.env.REACT_APP_MY_COOL_ENV}
        <img src={logo} className="other_logo" alt="logo" />
      </div>
    );
  }
}

export default App;
