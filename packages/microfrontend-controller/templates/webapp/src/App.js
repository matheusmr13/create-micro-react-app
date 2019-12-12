import { withMicrofrontend } from 'react-microfrontend';

import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    selectedMicrofrontend: null
  }

  handleMicrofrontendClick = selectedMicrofrontend => () => {
    this.setState({
      selectedMicrofrontend
    });
  }

  render() {
    const { microfrontends } = this.props;
    const { selectedMicrofrontend } = this.state;

    const MicrofrontendComponent = selectedMicrofrontend && microfrontends[selectedMicrofrontend].content;
    
    return (
      <div className="App">
        <p className="App__header">
          Welcome to Microfrontend World.<br/>
          Choose a microfrontend to show:
        </p>
        <div className="App__menu">
          {
            Object.keys(microfrontends).map(microfrontend => (
              <button
                onClick={this.handleMicrofrontendClick(microfrontend)}
                key={microfrontend}
                className={`App__menu-item${microfrontend === selectedMicrofrontend ? ' App__menu-item--selected' : ''}`}
              >
                {microfrontend}
              </button>
            ))
          }
        </div>
        <div className="App__content">
          {
            MicrofrontendComponent && (
              <div className="App__microfrontend-content">
                <MicrofrontendComponent />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
export default withMicrofrontend(App);
