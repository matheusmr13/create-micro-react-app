const swPrecache = require('sw-precache');
const UglifyJS = require('uglify-js');
const fs = require('fs');

const generateServiceWorker = (buildFolder) => new Promise((resolve, reject) => {
	const defaultConfig = {
		swFilePath: `${buildFolder}/service-worker.js`,
		cacheId: 'sw-precache-webpack-plugin',
		dontCacheBustUrlsMatching: /\.\w{8}\./,
		navigateFallback: '/index.html',
		navigateFallbackWhitelist: [/^(?!\/__).*/],
		staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
		staticFileGlobs: [
			`${buildFolder}/**/**.html`,
			`${buildFolder}/static/js/*.js`,
			`${buildFolder}/static/css/*.css`,
			`${buildFolder}/static/media/**`,
			`${buildFolder}/microfrontends/meta.json`,
			`${buildFolder}/microfrontends/**/**.html`,
			`${buildFolder}/microfrontends/**/*.js`,
			`${buildFolder}/microfrontends/**/*.css`,
			`${buildFolder}/microfrontends/**/static/media/**`,
		],
		stripPrefix: `${buildFolder}`,
	};

	function minify(code) {
		return UglifyJS.minify(code, {
				mangle: true,
				compress: {
				join_vars: true,
			},
			}).code;
	}

	swPrecache
		.generate(defaultConfig)
		.then(swCode => {
			fs.writeFile(
				defaultConfig.swFilePath,
				minify(swCode),
				error => error ? reject(error) : resolve(),
			);
		})
		.catch(reject);
});

module.exports = generateServiceWorker;