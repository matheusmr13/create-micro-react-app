var proxy = require('express-http-proxy');
var app = require('express')();

const axios = require('axios');
const PORT = 8008;

const BASE_URL = 'https://MYURL';
const url = new URL(BASE_URL);
const namespace = url.pathname;

app.get(`${namespace}microfrontends/meta.json`, function (req, res, next) {
	axios.get(`${BASE_URL}microfrontends/meta.json`).then(response => response.data).then(json => {
		res.json({
			...json,
			['MY_MODULE']: { host: 'http://localhost:3000' }
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