'use strict'

const { createServer, Socket } = require('net')

/**
 * @exports
 * @class
 */
module.exports = class ProxyWorld {
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
   * Returns a fancy world string
   * @returns {String}
   */
  get worldStr() {
    return `@${this.id}|${this.name}`
  }

  /**
   * Returns a fancy address string
   * @returns {String}
   */
  get addr() {
    return `${this.localIP}:${this.port}`
  }

  /**
   * Start the proxy server
   */
  start() {
    createServer((socket) => {

    }).listen(this.port, this.localIP, () => logger.info(`World${this.worldStr} proxy server listening on ${this.addr}.`))
  }

  /**
   * Stop the proxy server
   */
  stop() {
    process.exit(0)
  }
}
