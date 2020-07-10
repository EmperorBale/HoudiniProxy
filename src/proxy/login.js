'use strict'

const { createServer, Socket } = require('net')

/**
 * @exports
 * @class
 */
module.exports = class ProxyLogin {
  /**
   * @constructor
   * @param {String} localIP
   * @param {String} serverIP
   * @param {Number} loginPort
   */
  constructor({ localIP, serverIP, loginPort }) {
    /**
     * The local IP we'll create a server on
     * @type {String}
     */
    this.localIP = localIP
    /**
     * The server IP we'll connect to
     * @type {String}
     */
    this.serverIP = serverIP
    /**
     * The login port we'll create a server on and connect to
     * @type {Number}
     */
    this.loginPort = loginPort
  }
}
