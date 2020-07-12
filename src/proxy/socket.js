'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Socket {
  /**
   * @constructor
   * @param {Net.Socket} socket
   */
  constructor(socket) {
    /**
     * The socket
     * @type {Net.Socket}
     */
    this.socket = socket
  }

  /**
   * Returns whether we can write
   * @returns {Boolean}
   */
  get writable() {
    return this.socket.writable
  }

  /**
   * Writes data
   * @param {String} data
   */
  write(data) {
    this.socket.write(data)
  }

  /**
   * Destroys the socket
   */
  destroy() {
    this.socket.destroy()
  }
}
