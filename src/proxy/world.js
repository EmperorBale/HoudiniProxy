'use strict'

const { createServer, Socket } = require('net')
const Client = require('./client')

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
     * The client socket
     * @type {Client}
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
   * Returns a fancy world string
   * @returns {String}
   */
  get worldStr() {
    return `@${this.id}|${this.name}`
  }

  /**
   * Returns a fancy local address string
   * @returns {String}
   */
  get localAddr() {
    return `${this.localIP}:${this.port}`
  }

  /**
   * Returns a fancy world address string
   * @returns {String}
   */
  get worldAddr() {
    return `${this.serverIP}:${this.port}`
  }

  /**
   * Start the proxy server
   */
  async start() {
    try {
      await this.handler.load()
    } catch (err) {
      Logger.error(err.message)
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

      Logger.info(`Client has connected to ${this.worldStr} proxy server.`)

      this.client = new Client(socket, this)
      this.proxy = new Socket()

      this.proxy.connect(this.port, this.serverIP, () => {
        this.proxy.setNoDelay(true)
        this.proxy.setEncoding('utf8')

        Logger.info(`Proxy has connected to World${this.worldStr} ${this.worldAddr} server.`)
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
      this.client.socket.on('data', (data) => {
        this.handler.handleFromClient(data, this.proxy, this.client).then((modData) => {
          this.network.sendFromClient(modData, this.proxy)
        })
      })
      this.client.socket.on('close', () => this.close('client'))
      this.client.socket.on('error', () => this.close('client'))
    }).listen(this.port, this.localIP, () => Logger.info(`World${this.worldStr} proxy server listening on ${this.localAddr}.`))
  }

  /**
   * Closes the socket
   * @param {String} type
   */
  close(type) {
    if (type === 'proxy' && this.proxy) {
      this.proxy.destroy()
      this.proxy = undefined

      Logger.info('The proxy socket has been disconnected.')
    } else if (type === 'client' && this.client) {
      this.client.destroy()
      this.client = undefined

      Logger.info('The client socket has been disconnected.')
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
