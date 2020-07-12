'use strict'

const Socket = require('./socket')

/**
 * @exports
 * @class
 * @extends Socket
 */
module.exports = class Client extends Socket {
  /**
   * @constructor
   * @param {Net.Socket} socket
   * @param {ProxyWorld} server
   */
  constructor(socket, server) {
    super(socket)
    /**
     * The server
     * @type {ProxyWorld}
     */
    this.server = server
  }
}
