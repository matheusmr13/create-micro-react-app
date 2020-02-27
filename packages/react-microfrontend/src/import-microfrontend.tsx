import React from 'react';
import Helmet from 'react-helmet';
import Controller from './controller';
import createStore from './createlib/state/redux';
import { Provider } from 'react-redux';

const iframeStyle: any = {
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
const { Consumer: MicrofrontendContextConsumer } = MicrofrontendContext;

interface withMicrofrontendOptions {
  microfrontendKey: string
}

export const withMicrofrontend = (WrappedComponent, { microfrontendKey }: withMicrofrontendOptions) =>
  (props) => (
    <MicrofrontendContextConsumer>
      {microfrontends => (<WrappedComponent
            {...props}
            microfrontends={microfrontends}
            microfrontend={microfrontends[microfrontendKey]}
          />
        )
      }
    </MicrofrontendContextConsumer>
  );


interface ReactMicrofrontendProviderProps {
  opts?: {
    packageName?: string
    interface?: string
    view?: any
  }
}
interface ReactMicrofrontendProviderState {
  iframesToLoad: string[],
  cssToLoad: string[],
  jsToLoad: string[],
  styleToLoad: any,
  microfrontends: any
}

class ReactMicrofrontend extends React.Component<ReactMicrofrontendProviderProps, ReactMicrofrontendProviderState> {
  store: any

  constructor(props) {
    super(props);
    this.state = {
      iframesToLoad: [],
      cssToLoad: [],
      jsToLoad: [],
      styleToLoad: {},
      microfrontends: null
    };
  }

  componentDidMount() {
    const { opts } = this.props;

    const microfrontendsController = new Controller(opts);

    microfrontendsController
      .onMicrofrontendsInfosDiscovered((microfrontends) => {
        this.setState({
          iframesToLoad: Object.values(microfrontends).map((microfrontend: any) => microfrontend.host)
        });
      })
      .onMicrofrontendsInfosLoaded((microfrontends) => {
        const allJsFiles = [].concat.apply([], Object.values(microfrontends).map((microfrontends: any) => microfrontends.files.js));
        const allCssFiles = [].concat.apply([], Object.values(microfrontends).map((microfrontends: any) => microfrontends.files.css || []));
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
      .onMicrofrontendsRegistered((microfrontends) => {
        this.store = createStore();
        Object.values(microfrontends).forEach((microfrontend: any) => {
          if (microfrontend.lib) {
            this.store.injectReducer(microfrontend.name, microfrontend.lib.reducers);
          }
        });

        return this.store;
      })
      .onMicrofrontendsInitialized((microfrontends) => {
        this.setState({
          microfrontends
        });
      })
      .initialize()
  }

  render() {
    const {
      jsToLoad,
      cssToLoad,
      styleToLoad,
      iframesToLoad,
      microfrontends
    } = this.state;

    const { children } = this.props;

    return (
      <React.Fragment>
        { microfrontends && ((
          <MicrofrontendContext.Provider value={microfrontends} >
            <Provider store={this.store}>
              {children}
            </Provider>
          </MicrofrontendContext.Provider>
        )) }
        <Helmet>
          { !!jsToLoad.length && jsToLoad.map((url) => <script key={url} src={url} type="text/javascript" /> )}
          { !!cssToLoad.length && cssToLoad.map((url) => <link key={url} href={url} type="text/css" rel="stylesheet" /> )}
          { Object.values(styleToLoad).length && Object.values(styleToLoad).map((styleContent: any) => styleContent.map(content => <style type="text/css" >{content}</style> ))}
        </Helmet>
        {
          !!iframesToLoad.length && iframesToLoad.map((iframeSrc) => (
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
