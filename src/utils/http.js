'use strict'

const { get } = require('https')

/**
 * @exports
 * Retrieves the servers
 * @param {String} url
 * @returns {String}
 */
exports.getServers = (url) => {
  return new Promise((resolve) => {
    get(url, (res) => res.on('data', (data) => resolve(String(data))))
  })
}
