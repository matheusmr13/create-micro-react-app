const { getAppFile, promiseWriteFile, getReactAppRewiredPath } = require('../utils/fs');
const { promiseExec, getEnvString } = require('../utils/process');

const package = getAppFile('package.json');

const createMockServer = (baseUrl) => {
	const proxy = require('express-http-proxy');
	const app = require('express')();

	const axios = require('axios');
	const PORT = 3000;

	const BASE_URL = baseUrl;
	const url = new URL(BASE_URL);
	const namespace = url.pathname;

	app.get(`${namespace}microfrontends/meta.json`, function (req, res, next) {
		axios.get(`${BASE_URL}microfrontends/meta.json`).then(response => response.data).then(json => {
			res.json({
				...json,
				[package.name]: { host: 'http://localhost:3001' }
			});
		});
	});

	app.use(namespace, proxy(BASE_URL, {
		proxyReqPathResolver: req => {
			return `${namespace}${req.url}`;
		}
	}));

	app.use('/', proxy(url.origin));

	app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))
}

const startMock = async (baseUrl) => {
	promiseExec(`PORT=${3001} npm run start`);

	createMockServer(baseUrl);
}
module.exports = startMock;