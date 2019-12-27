import { withMicrofrontend } from 'react-microfrontend';

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
    console.info(microfrontends);

    return (
      <div className="App">
        <div className="App__title">
        {process.env.REACT_APP_MY_COOL_ENV_FILE_TITLE} - {process.env.REACT_APP_MY_COOL_ENV_TITLE}
        </div>
        <div className="App__menu">
          {
            Object.values(microfrontends).map(microfrontend => (
              <div className="App_microfrontend-container" key={microfrontend.name}>
                { microfrontend.view && <microfrontend.view.App /> }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
export default withMicrofrontend(App);
