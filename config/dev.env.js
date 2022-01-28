'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://blog.zhloong.xyz"'
  // BASE_API: '"http://localhost:8080"'

})
