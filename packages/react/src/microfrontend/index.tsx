import Communication from './communication';

const getScriptSrcs = () => {
  let jsSrcs: Array<string> = [];
  document.querySelectorAll('script').forEach(scriptTag => {
    jsSrcs.push(scriptTag.src.toString());
  });
  return jsSrcs;
}

const ExportMicrofrontend = (objectToExport) => {
  const registerMicrofrontend = window['__shared__']['__core__']['registerMicrofrontend'];

  if (registerMicrofrontend) {
    registerMicrofrontend(objectToExport.name, objectToExport);
  } else {
    const communicate = new Communication();
    communicate.send(Communication.TYPE.LOAD);
    communicate.send(Communication.TYPE.SCRIPT, getScriptSrcs());

    const mutationObserver = new MutationObserver(function (mutations) {
      setTimeout(() => {
        const styleList: Array<string> = [];
        document.querySelectorAll('style').forEach(a => styleList.push(a.innerHTML));

        communicate.send(Communication.TYPE.STYLE, styleList);
      }, 100)
    });
    const head = document.querySelector('head');

    if (head) {
      mutationObserver.observe(head.getRootNode(), {
        childList: true,
        subtree: true
      });
    }
  }
}

export default ExportMicrofrontend;
