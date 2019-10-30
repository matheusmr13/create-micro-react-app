import React from 'react';
import logo from './logo.svg';
import Helmet from 'react-helmet'
import './App.css';

import microfrontends from './microfrontend.json';
import importScript from './import-script';

class App extends React.Component {
  state = {
    microfrontends: null,
    registeredMicrofrontends: []
  }

  componentDidMount() {
    window.registerMicrofrontend = (name, newMicrofrontend) => {
      this.setState({
        registeredMicrofrontends: {
          ...(this.state.registeredMicrofrontends),
          name: newMicrofrontend
        }
      });
    }

    fetch('/microfrontends/meta.json').then(response => response.json()).then(json => {
      this.setState({microfrontends: json});
    });
  }

  render() {
    const { microfrontends, registeredMicrofrontends } = this.state;
    if (!microfrontends) return null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <div>
            {Object.values(registeredMicrofrontends).map(Micro => (
              <div>
                <Micro />
              </div>
            ))}
          </div>
        </header>
        <Helmet>
          { Object.keys(microfrontends).map(moduleName => [
              <script>{importScript(moduleName)}</script>,
              microfrontends[moduleName].js.map(url => <script key={url} src={`/microfrontends/${moduleName}${url}`}  type="text/javascript"></script>),
              microfrontends[moduleName].css.map(url => <link rel="stylesheet" type="text/css" href={`/microfrontends/${moduleName}/${url}`} />)
            ]
          )
          }
        </Helmet>
      </div>
    );
  }
}
export default App;
