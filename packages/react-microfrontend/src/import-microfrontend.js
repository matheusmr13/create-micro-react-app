import React from 'react';
import Helmet from 'react-helmet';
import Controller from './controller';
// import createStore from './state/redux';

const iframeStyle = {
  position: 'absolute',
  height: 0,
  width: 0,
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  border:0
};

const MicrofrontendContext = React.createContext({});

export const withMicrofrontend = (WrappedComponent, { microfrontendKey } = {}) => props => (
  <MicrofrontendContext.Consumer>
    { microfrontends => {
      return (
        <WrappedComponent
          {...props}
          microfrontend={
            microfrontends[microfrontendKey] ? microfrontends[microfrontendKey].content : microfrontends
          }
          microfrontends={microfrontends}
        />
      )
    }}
  </MicrofrontendContext.Consumer>
);


class ReactMicrofrontend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframesToLoad: null,
      cssToLoad: null,
      jsToLoad: null,
      styleToLoad: {},
      microfrontends: {}
    };
  }

  componentDidMount() {
    const controller = new Controller();
    controller
      .onMicrofrontendsDiscovered((microfrontends) => {
        this.setState({
          iframesToLoad: Object.values(microfrontends).map(microfrontend => microfrontend.host)
        });
      })
      .onMicrofrontendsLoaded((microfrontends) => {
        const allJsFiles = [].concat.apply([], Object.values(microfrontends).map(microfrontends => microfrontends.files.js));
        const allCssFiles = [].concat.apply([], Object.values(microfrontends).map(microfrontends => microfrontends.files.css || []));
        this.setState({
          jsToLoad: allJsFiles,
          cssToLoad: allCssFiles
        })
      })
      .onMicrofrontendHotReload(() => {
        window.location.reload();
      })
      .onMicrofrontendStyleChange((name, styles) => {
        const { styleToLoad } = this.state;
        this.setState({
          styleToLoad: {
            ...styleToLoad,
            [name]: styles
          }
        })
      })
      .onMicrofrontendsInitialized((microfrontends) => {
        // const store = createStore();
        // Object.values(microfrontends).forEach(microfrontend => {
        //   if (microfrontend.lib) {
        //     store.injectReducer(microfrontend.name, microfrontend.lib.reducers);
        //   }
        // })

        this.setState({
          microfrontends
        })
      })
      .initialize()
  }

  render() {
    const { iframesToLoad, jsToLoad, cssToLoad, styleToLoad, microfrontends } = this.state;
    return (
      <React.Fragment>
        <MicrofrontendContext.Provider value={microfrontends} >
          {this.props.children}
        </MicrofrontendContext.Provider>
        <Helmet>
          { jsToLoad && jsToLoad.map((url) => <script key={url} src={url} type="text/javascript" /> )}
          { cssToLoad && cssToLoad.map((url) => <link key={url} href={url} type="text/css" rel="stylesheet" /> )}
          { Object.values(styleToLoad).length && Object.values(styleToLoad).map((styleContent) => styleContent.map(content => <style type="text/css" >{content}</style> ))}
        </Helmet>
        {
          iframesToLoad && iframesToLoad.map((iframeSrc) => (
            <iframe
              key={iframeSrc}
              style={iframeStyle}
              src={iframeSrc}
              title={iframeSrc}
            />
          ))
        }
      </React.Fragment>
    );
  }
}


export default ReactMicrofrontend;
