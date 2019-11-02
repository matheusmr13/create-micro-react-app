import React from 'react';
import logo from './logo.svg';
import Helmet from 'react-helmet'
import './App.css';

import Microfrontend from 'microfrontend-controller';


import importScript from './import-script';

let laodedOnce = false;
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

    Microfrontend.getMicrofrontends().then(json => {
      this.setState({microfrontends: json});
    });
    window.addEventListener("message", (event) => {
      if (event.data && event.data.source && event.data.source.indexOf('react-devtool') > -1) return;
      
      console.info(event);
      if (event.data === 'LOAD') {
        if (laodedOnce) {
          window.location.reload();
        }
        laodedOnce = true;
      } else if (event.data.type === 'SCRIPT') {
        const { microfrontends } = this.state;
        const newMicro = Object.assign({}, microfrontends);
        newMicro['react-dynamic-app'].js.push(event.data.payload);
        this.setState({
          microfrontends: newMicro
        })
      }
    }, false);
  }

  render() {
    const { microfrontends, registeredMicrofrontends } = this.state;
    if (!microfrontends) return null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            klalalala <code>src/App.js</code> and save to reload.
          </p>
          <div>
            {Object.values(registeredMicrofrontends).map(Micro => (
              <div>
                <Micro />
              </div>
            ))}
          </div>
        </header>
        <div>
          { Object.keys(microfrontends).map(moduleName => <iframe src={microfrontends[moduleName].host} />) }
        </div>
        <Helmet>
          { Object.keys(microfrontends).map(moduleName => [
              <script>{importScript(moduleName)}</script>,
              microfrontends[moduleName].js.map(url => <script key={url} src={url}  type="text/javascript"></script>),
              microfrontends[moduleName].css.map(url => <link rel="stylesheet" type="text/css" href={url} />)
            ]
          )
          }
        </Helmet>
      </div>
    );
  }
}
export default App;
