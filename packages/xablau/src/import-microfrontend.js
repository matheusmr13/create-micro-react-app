import React from 'react';
import Helmet from 'react-helmet';
import Controller from './controller';

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

class ReactMicrofrontend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframesToLoad: null,
      cssToLoad: null,
      jsToLoad: null,
      styleToLoad: null
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
        window.locationo.reload();
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
      .initialize()
  }

  render() {
    const { iframesToLoad, jsToLoad, cssToLoad, styleToLoad } = this.state;
    console.info(iframesToLoad, jsToLoad, cssToLoad, styleToLoad, this.props.children);
    return (
      <React.Fragment>
        {/* <div>
          {
            Object.values(registeredMicrofrontends).map((Micro) => (
              <div>
                <Micro />
              </div>
            ))
          }
        </div> */}
        {this.props.children}
        <Helmet>
          { jsToLoad && jsToLoad.map((url) => <script key={url} src={url} type="text/javascript" /> )}
          { cssToLoad && cssToLoad.map((url) => <link key={url} href={url} type="text/css" rel="stylesheet" /> )}
          { styleToLoad && styleToLoad.map((styleContent) => <style type="text/css" >{styleContent}</style> )}
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
      </ React.Fragment>
    );
  }
}


export default ReactMicrofrontend;
