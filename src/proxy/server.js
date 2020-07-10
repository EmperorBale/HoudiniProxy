'use strict'

const { createServer, Socket } = require('net')

/**
 * @exports
 * @class
 */
module.exports = class ProxyServer {
  /**
   * @constructor
   * @param {String} localIP
   * @param {String} serverIP
   * @param {Number} id
   * @param {String} name
   * @param {Number} port
   */
  constructor(localIP, serverIP, { id, name, port }) {
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
     * The server ID
     * @type {Number}
     */
    this.id = id
    /**
     * The server name
     * @type {String}
     */
    this.name = name
    /**
     * server port
     * @type {Number}
     */
    this.port = port
  }
}
