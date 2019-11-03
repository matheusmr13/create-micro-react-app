import Communication from './communication/microfrontend-client';
import Shared from './shared';

const getScriptSrcs = () => {
  let jsSrcs = [];
  document.querySelectorAll('script').forEach(scriptTag => {
    jsSrcs.push(scriptTag.src);
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
      mutations.forEach(function() {
        const styleList = [];
        document.querySelectorAll('style').forEach(a => styleList.push(a.innerHTML));

        communicate.send(Communication.TYPE.STYLE, getScriptSrcs(styleList));
      });
    });
    mutationObserver.observe(document.querySelector('head'), {
      childList: true
    });
  }
}

export default ExportMicrofrontend;
