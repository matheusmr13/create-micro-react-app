

const { getAppFile } = require('../utils/fs');

const package = getAppFile('package.json');

const { override } = require('customize-cra');

const overridePublicPath = () => config => {
	config.output.jsonpFunction = package.name;
	config.output.publicPath = `/microfrontends/${package.name}/`;
	return config;
};

module.exports = {
	webpack: override(
		overridePublicPath()
	)
}