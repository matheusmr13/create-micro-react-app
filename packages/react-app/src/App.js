import React from 'react';
import logo from './logo.svg';
import './App.css';

// import importScript from './import-script';

class App extends React.Component {
  state = {
    selectedMicrofrontend: null,
    microfrontends: null
  }

  componentDidMount() {
  }

  handleMicrofrontendClick = selectedMicrofrontend => () => {
    this.setState({
      selectedMicrofrontend
    });
  }

  render() {
    const { microfrontends } = this.state;
    if (!microfrontends) return null;
    return (
      <div className="App">
        <div className="App__menu">
          {
            Object.keys(microfrontends).map(microfrontend => (
              <button onClick={this.handleMicrofrontendClick(microfrontend)}>
                {microfrontend}
              </button>
            ))
          }
        </div>
      </div>
    );
  }
}
export default App;
