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

    /**
     * Start the proxy server
     */
    this.start()
    /**
     * Stop the proxy server gracefully
     */
    process.on('SIGTERM', () => this.stop())
    process.on('SIGINT', () => this.stop())
  }

  /**
   * Returns a fancy address string
   * @returns {String}
   */
  get addr() {
    return `${this.localIP}:${this.loginPort}`
  }

  /**
   * Start the proxy server
   */
  start() {
    createServer((socket) => {

    }).listen(this.loginPort, this.localIP, () => logger.info(`Login proxy server listening on ${this.addr}.`))
  }

  /**
   * Stop the proxy server
   */
  stop() {
    process.exit(0)
  }
}
