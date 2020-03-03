const path = require('path')

module.exports = {
  extends: 'airbnb',
  env: {
    "jest": true
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, 'packages')
      }
    }
  },
  rules: {
    ['arrow-parens']: [2, "as-needed", { "requireForBlockBody": true }]
  },
}
