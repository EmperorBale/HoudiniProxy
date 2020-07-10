'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Handler {
  /**
   * @static
   * Handles outgoing data from the proxy to the client
   * @param {String} data
   * @param {Net.Socket} client
   * @returns {Promise}
   */
  static handleFromProxy(data, client) {
    return new Promise((resolve) => {
      resolve(data)
    })
  }

  /**
   * @static
   * Handles incoming data from the client to the proxy
   * @param {String} data
   * @param {Net.Socket} proxy
   * @returns {Promise}
   */
  static handleFromClient(data, proxy) {
    return new Promise((resolve) => {
      resolve(data)
    })
  }
}
