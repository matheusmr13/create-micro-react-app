import React from 'react';
// import logo from './logo.svg';
import Helmet from 'react-helmet';
import Communication from './communication/app-client';
import Controller from './controller';

const IFRAME = {
  position: 'absolute',
  height: 0,
  width: 0,
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  border:0
};

class ReactMicrofrontend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      microfrontends: null,
      registeredMicrofrontends: [],
      microfrontendNames: null
    };
    this.laodedOnce = false;
  }

  onLoadMessage = () => () => {
    if (this.laodedOnce) {
      window.location.reload();
    }
    this.laodedOnce = true;
  }

  onScriptMessage = message => () => {
    const { microfrontends = {} } = this.state;
    const newMicro = { ...microfrontends };
    newMicro[message.origin] = {
      js: event.data.payload,
      css: []
    };
    this.setState({
      microfrontends: newMicro,
    });
  }

  onStyleMessage = message => () => {
    const { microfrontends = {} } = this.state;
    const newMicro = { ...microfrontends };
    newMicro[message.origin] = {
      js: microfrontends[message.origin].js,
      css: event.data.payload
    };
    this.setState({
      microfrontends: newMicro,
    });
  }

  componentDidMount() {
    shared.set('registerMicrofrontend', (name, newMicrofrontend) => {
      const { registeredMicrofrontends } = this.state;
      this.setState({
        registeredMicrofrontends: {
          ...(registeredMicrofrontends),
          [name]: newMicrofrontend,
        },
      });
    });

    getMicrofrontends().then((json) => {
      this.setState({ microfrontendNames: Object.keys(json).reduce((agg, name) => Object.assign(agg, { [name]: json[name].host }), {}) });
    });

    const communication = new Communication();
    communication.onMessage((message) => {
      ({
        [Communication.TYPE.LOAD]: this.onLoadMessage(message),
        [Communication.TYPE.SCRIPT]: this.onScriptMessage(message),
        [Communication.TYPE.STYLE]: this.onStyleMessage(message)
      }[message.type] || (() => { console.info(`Unknown type ${message.type}`); }))();
    }).initialize();
  }

  render() {
    const { microfrontends, registeredMicrofrontends, microfrontendNames } = this.state;
    // console.info('rendering helmet', microfrontendNames, registeredMicrofrontends);
    if (!microfrontendNames) return null;
    return (
      <div className="ReactMicrofrontend">
        <div>
          {
            Object.values(registeredMicrofrontends).map((Micro) => (
              <div>
                <Micro />
              </div>
            ))
          }
        </div>
        <div>
          { Object.keys(microfrontendNames).map((moduleName) => <iframe style={IFRAME} src={microfrontendNames[moduleName]} title={moduleName} />) }
        </div>
        { microfrontends && (
          <Helmet>
            { Object.keys(microfrontends).map((moduleName) => [
              microfrontends[moduleName].js.map((url) => <script key={url} src={url} type="text/javascript" />),
              microfrontends[moduleName].css.map((styleContent) => <style type="text/css" >{styleContent}</style>),
            ])}
          </Helmet>
        )}
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}
export default ReactMicrofrontend;
