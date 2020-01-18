export { default as Shared } from './shared';
export { default as Observable } from './observable';
export { default as CreateLib } from './state/createLib';

export { default as ImportMicrofrontend, withMicrofrontend } from './import-microfrontend';
export { default as ExportMicrofrontend } from './expose-microfrontend';


const isVersionsDifferent = (versions1, versions2) => {
  const versions1Keys = Object.keys(versions1);

  const versions2Keys = Object.keys(versions2);

  if (versions2Keys.length !== versions1Keys.length) {
    return true;
  }

  const hasDiffMicro = newMicrofrontendKeys.find((newMicro) => {
    return oldMicrofrontend[newMicro] !== newMicrofrontend[newMicro];
  });

  return (!!hasDiffMicro);
}
const microfrontendFolderName = 'microfrontends';
const LOCAL_STORAGE_KEY = 'microfrontend-versions-cache';
export const hasMicrofrontendVersionsChanged = () => new Promise((resolve, reject) => {
  const storageVersions = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storageVersions) return resolve(true);

  const storageVersionsJson = JSON.parse(storageVersions);

  fetch(`./${microfrontendFolderName}/versions.json`).then(response => response.json()).then(versions => {
    const hasDiff = isVersionsDifferent(versions, storageVersionsJson);
    resolve(hasDiff);
  }).catch(reject);
});

export const saveCurrentMicrofrontendsVersion = () => new Promise((resolve) => {
  fetch(`./${microfrontendFolderName}/versions.json`).then(response => response.json()).then(versions => {
    localStorage.setItem(JSON.stringify(versions));
    resolve();
  }).catch(() => {
    setTimeout(saveCurrentMicrofrontendsVersion, 1000);
  });
})
