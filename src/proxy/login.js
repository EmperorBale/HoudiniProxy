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
     * The network class
     * @type {Object}
     */
    this.network = require('./system/network')
    /**
     * The handler class
     * @type {Object}
     */
    this.handler = require('./system/handler')

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
     * The client socket
     * @type {Net.Socket}
     */
    this.client = undefined
    /**
     * The proxy socket
     * @type {Net.Socket}
     */
    this.proxy = undefined

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
  async start() {
    try {
      await this.handler.load()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    } finally {
      this.listen()
    }
  }

  /**
   * Listens to the proxy config
   */
  listen() {
    createServer((socket) => {
      socket.setNoDelay(true)
      socket.setEncoding('utf8')

      logger.info(`Client has connected to login proxy server.`)

      this.client = socket
      this.proxy = new Socket()

      this.proxy.connect(this.loginPort, this.serverIP, () => {
        this.proxy.setNoDelay(true)
        this.proxy.setEncoding('utf8')

        logger.info(`Proxy has connected to login server.`)
      })

      // Proxy=>Client events
      this.proxy.on('data', (data) => {
        this.handler.handleFromProxy(data, this.client, this.proxy).then((modData) => {
          this.network.sendFromProxy(modData, this.client)
        })
      })
      this.proxy.on('close', () => this.close('proxy'))
      this.proxy.on('error', () => this.close('proxy'))

      // Client=>Proxy events
      this.client.on('data', (data) => {
        this.handler.handleFromClient(data, this.proxy, this.client).then((modData) => {
          this.network.sendFromClient(modData, this.proxy)
        })
      })
      this.client.on('close', () => this.close('client'))
      this.client.on('error', () => this.close('client'))
    }).listen(this.loginPort, this.localIP, () => logger.info(`Login proxy server listening on ${this.addr}.`))
  }

  /**
   * Closes the socket
   * @param {String} type
   */
  close(type) {
    if (type === 'proxy' && this.proxy !== undefined) {
      this.proxy.destroy()
      this.proxy = undefined

      logger.info('The proxy socket has been disconnected.')
    } else if (type === 'client' && this.client !== undefined) {
      this.client.destroy()
      this.client = undefined

      logger.info('The client socket has been disconnected.')
    }
  }

  /**
   * Stop the proxy server
   */
  stop() {
    this.close('proxy')
    this.close('client')

    process.exit(0)
  }
}
