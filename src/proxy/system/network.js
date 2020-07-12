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
   * @param {Net.Socket|Client} client
   */
  static sendFromProxy(data, client) {
    if (client && client.writable) {
      Logger.outgoing(data)
      client.write(data + '\0')
    }
  }

  /**
   * @static
   * Sends incoming data from the client to the proxy
   * @param {String} data
   * @param {Net.Socket} proxy
   */
  static sendFromClient(data, proxy) {
    if (proxy && proxy.writable) {
      if (Cipher.active() && Cipher.hasMask(data)) {
        Logger.incoming(Cipher.decrypt(data))
      } else {
        Logger.incoming(data)
      }

      proxy.write(data + '\0')
    }
  }
}
