import Communication from './communication/microfrontend-client';
import Shared from './shared';

const getScriptSrcs = () => {
  let jsSrcs  : Array<string> = [];
  document.querySelectorAll('script').forEach(scriptTag => {
    jsSrcs.push(scriptTag.src.toString());
  });
  return jsSrcs;
}

const shared = new Shared('__core__');
const ExportMicrofrontend = (objectToExport) => {
  const registerMicrofrontend = shared.get('registerMicrofrontend');

  if (registerMicrofrontend) {
    registerMicrofrontend(process.env.REACT_APP_PACKAGE_NAME, objectToExport);
  } else {
    const communicate = new Communication();
    communicate.send(Communication.TYPE.LOAD);
    communicate.send(Communication.TYPE.SCRIPT, getScriptSrcs());

    const mutationObserver = new MutationObserver(function(mutations) {
      setTimeout(() => {
        const styleList : Array<string>  = [];
        document.querySelectorAll('style').forEach(a => styleList.push(a.innerHTML));

        communicate.send(Communication.TYPE.STYLE, styleList);
      }, 100)
    });
    const head = document.querySelector('head');

    if (head) {
      mutationObserver.observe(head.getRootNode(), {
        childList: true
      });
    }
  }
}

export default ExportMicrofrontend;
