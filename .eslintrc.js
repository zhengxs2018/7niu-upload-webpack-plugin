'use strict'

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      impliedStrict: true
    }
  }
}
