const Controller = require('./react-controller');
const microfrontendFolderName = 'microfrontends';

const getMicrofrontends = () => fetch(`/${microfrontendFolderName}/meta.json`).then(response => response.json());


module.exports = {
	getMicrofrontends,
	Controller
};