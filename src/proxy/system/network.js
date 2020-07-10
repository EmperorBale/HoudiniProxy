'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Network {
  /**
   * @static
   * Sends outgoing data from the proxy to the client
   * @param {String} data
   * @param {Net.Socket} client
   */
  static sendFromProxy(data, client) {
    if (client.writable) {
      logger.outgoing(data)
      client.write(data)
    }
  }

  /**
   * @static
   * Sends incoming data from the client to the proxy
   * @param {String} data
   * @param {Net.Socket} proxy
   */
  static sendFromClient(data, proxy) {
    if (proxy.writable) {
      logger.incoming(data)
      proxy.write(data)
    }
  }
}
