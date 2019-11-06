

const { getAppFile } = require('../utils/fs');

const package = getAppFile('package.json');

const MICROFRONTEND_FOLDER_NAME = 'microfrontends'; // TODO: get from build-configuration.js
const { override, overrideDevServer } = require('customize-cra');

const overrideWebpackConfigs = () => config => {
	config.output.jsonpFunction = package.name;

	if (process.env.NODE_ENV === 'production') {
		if (process.env.IS_MICROFRONTEND) {
			config.output.publicPath = `./${MICROFRONTEND_FOLDER_NAME}/${package.name}/`;
		}
	} else {
		if (process.env.IS_MICROFRONTEND) {
			config.output.publicPath = `http://localhost:${process.env.PORT}/`;
		}
	}

	return config;
};

const overrideDevServerConfigs  = () => config => {
	if (process.env.IS_MICROFRONTEND) {
		config.headers = {
			"Access-Control-Allow-Origin": "http://localhost:3000",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
		}
	}
	return config;
};

module.exports = {
	webpack: override(
		overrideWebpackConfigs()
	),
	devServer: overrideDevServer(
		// dev server plugin
		overrideDevServerConfigs()
	  )
}