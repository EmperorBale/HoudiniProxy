'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Handler {
  /**
   * @static
   * Returns whether the data is XML or not
   * @param {String} data
   * @returns {Boolean}
   */
  static isXML(data) {
    return data.charAt() === '<' && data.charAt(data.length - 1) === '>'
  }

  /**
   * @static
   * Returns whether the data is XT or not
   * @param {String} data
   * @returns {Boolean}
   */
  static isXT(data) {
    return data.charAt() === '%' && data.charAt(data.length - 1) === '%'
  }

  /**
   * @static
   * Handles outgoing data from the proxy to the client
   * @param {String} data
   * @param {Net.Socket} client
   * @returns {Promise}
   */
  static handleFromProxy(data, client) {
    data = data.split('\0')[0]

    return new Promise((resolve) => {
      resolve(data + '\0')
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
    data = data.split('\0')[0]

    return new Promise((resolve) => {
      resolve(data + '\0')
    })
  }
}
