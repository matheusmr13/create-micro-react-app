const workboxBuild = require('workbox-build');

module.exports = () => workboxBuild.generateSW({
  swDest: './build/service-worker.js',
  globDirectory: './build',
  globPatterns: ['**/*.{js,css,html,json}'],
  clientsClaim: true,
  // exclude: [/\.map$/, /asset-manifest\.json$/],
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [
    // Exclude URLs starting with /_, as they're likely an API call
    new RegExp('^/_'),
    // Exclude any URLs whose last part seems to be a file extension
    // as they're likely a resource and not a SPA route.
    // URLs containing a "?" character won't be blacklisted as they're likely
    // a route with query params (e.g. auth callbacks).
    new RegExp('/[^/?]+\\.[^/]+$'),
  ],
});
