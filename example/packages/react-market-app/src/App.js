import React from 'react';
import './App.css';

// import importScript from './import-script';

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
        <div className="App__menu">
          {
            Object.keys(microfrontends).map(microfrontend => (
              <button onClick={this.handleMicrofrontendClick(microfrontend)}>
                {microfrontend}
              </button>
            ))
          }
          {
            MicrofrontendComponent && (
              <div className="App_microfrontend-container">
                <MicrofrontendComponent />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
export default App;
