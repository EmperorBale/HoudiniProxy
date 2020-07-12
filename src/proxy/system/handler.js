'use strict'

const readdir = require('util').promisify(require('fs').readdir)
const Direction = require('../enums/Direction')
const ProxyType = require('../enums/ProxyType')

/**
 * @exports
 * @class
 */
module.exports = class Handler {
  /**
   * @static
   * The XML handlers
   * @type {Object}
   */
  static xmlHandlers = {
    [Direction.IN]: {

    },
    [Direction.OUT]: {

    }
  }
  /**
   * @static
   * @private
   * The XML handlers
   * @type {Object}
   */
  static #xmlHandlers = {
    [Direction.IN]: {

    },
    [Direction.OUT]: {

    }
  }
  /**
   * @static
   * The XT handlers
   * @type {Object}
   */
  static xtHandlers = {
    [Direction.IN]: {

    },
    [Direction.OUT]: {
      'cipher': { functionName: 'handleCipher' }
    }
  }
  /**
   * @static
   * @private
   * The XT handlers
   * @type {Object}
   */
  static #xtHandlers = {
    [Direction.IN]: {

    },
    [Direction.OUT]: {
      'handleCipher': 'cipher'
    }
  }

  /**
   * @static
   * Loads the handlers
   */
  static async load() {
    const dir = `${process.cwd()}/src/proxy/handlers`
    const handlers = await readdir(dir)

    for (let i = 0; i < handlers.length; i++) {
      const [fileName, fileType] = handlers[i].split('.')

      if (fileType === 'js') {
        const handler = require(`${dir}/${fileName}`)
        const functionNames = Object.keys(handler)

        for (let i = 0; i < functionNames.length; i++) {
          const functionName = functionNames[i]

          for (let direction in Direction) {
            direction = Direction[direction]

            if (this.#xmlHandlers[direction][functionName]) {
              const action = this.#xmlHandlers[direction][functionName]

              if (this.xmlHandlers[direction][action]) {
                const xml = this.xmlHandlers[direction][action]

                if (xml.functionName === functionName) {
                  xml.callback = handler[functionName]
                } else {
                  throw new Error(`Unmatching XML function name: '${functionName}'-'${xml.functionName}'.`)
                }
              } else {
                throw new Error(`Unknown XML action: '${action}'.`)
              }
            } else if (this.#xtHandlers[direction][functionName]) {
              const subject = this.#xtHandlers[direction][functionName]

              if (this.xtHandlers[direction][subject]) {
                const xt = this.xtHandlers[direction][subject]

                if (xt.functionName === functionName) {
                  xt.callback = handler[functionName]
                } else {
                  throw new Error(`Unmatching XT function name: '${functionName}'-'${xt.functionName}'.`)
                }
              } else {
                throw new Error(`Unknown XT subject: '${subject}'.`)
              }
            }
          }
        }
      }
    }
  }

  /**
   * @static
   * Returns whether the data is XML or not
   * @param {String} data
   * @returns {Boolean}
   */
  static isXML(data) {
    return data.charAt() === '<' && data.charAt(data.length - 1) === '>' && data.indexOf('<body action=') !== -1
  }

  /**
   * @static
   * Returns whether the data is XT or not
   * @param {String} data
   * @returns {Boolean}
   */
  static isXT(data) {
    return data.charAt() === '%' && data.charAt(data.length - 1) === '%'
  }

  /**
   * @static
   * Returns whether the data is encrypted or not
   * @param {String} data
   * @returns {Boolean}
   */
  static isEncrypted(data) {
    return serverType === ProxyType.WORLD && Cipher.active() && Cipher.hasMask(data)
  }

  /**
   * @static
   * Handles XML data
   * @param {String} data
   * @param {String} direction
   * @param {Net.Socket|Client} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  static handleXML(data, direction, client, proxy) {
    // This is so epic!
    const action = direction === Direction.IN
      ? data.split(`='`)[2].split(`'`)[0]
      : data.split('="')[2].split('"')[0]

    if (this.xmlHandlers[direction][action]) {
      data = this.xmlHandlers[direction][action].callback(data, direction, client, proxy)
    }

    return data
  }

  /**
   * @static
   * Handles XT data
   * @param {String} data
   * @param {String} direction
   * @param {Net.Socket|Client} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  static handleXT(data, direction, client, proxy) {
    const dataArr = data.split('%').splice(direction === Direction.IN ? 3 : 2)
    const [subject] = dataArr

    dataArr.pop()

    if (this.xtHandlers[direction][subject]) {
      data = this.xtHandlers[direction][subject].callback(dataArr, direction, client, proxy)
    }

    // Reform filtered data
    if (Array.isArray(data)) {
      direction === Direction.IN
        ? data.unshift(['', 'xt', 's'].join('%'))
        : data.unshift(['', 'xt'].join('%'))
      data.push('')
      data = data.join('%')
    }

    // Recipher data when needed
    if (Cipher.active(data) && direction === Direction.IN) {
      data = Cipher.encrypt(data)
    }

    return data
  }

  /**
   * @static
   * Handles encrypted data
   * @param {String} data
   * @param {String} direction
   * @param {Net.Socket|Client} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  static handleEncryptedData(data, direction, client, proxy) {
    return this.handleXT(Cipher.decrypt(data), direction, client, proxy)
  }

  /**
   * @static
   * Handles outgoing data from the proxy to the client
   * @param {String} data
   * @param {Net.Socket|Client} client
   * @param {Net.Socket} proxy
   * @returns {Promise}
   */
  static handleFromProxy(data, client, proxy) {
    if (serverType === ProxyType.WORLD) {
      data = data.split('\0')
      data.pop()

      return new Promise((resolve) => {
        // TCP loves to append data
        // This performs appendation with (edited) data
        for (let i = 0; i < data.length; i++) {
          if (this.isXML(data[i])) {
            data[i] = this.handleXML(data[i], Direction.OUT, client, proxy)
          } else if (this.isXT(data[i])) {
            data[i] = this.handleXT(data[i], Direction.OUT, client, proxy)
          }
        }

        resolve(data.join('\0'))
      })
    } else {
      data = data.split('\0')[0]

      return new Promise((resolve) => {
        if (this.isXML(data)) {
          resolve(this.handleXML(data, Direction.OUT, client, proxy))
        } else if (this.isXT(data)) {
          resolve(this.handleXT(data, Direction.OUT, client, proxy))
        } else {
          resolve(data)
        }
      })
    }
  }

  /**
   * @static
   * Handles incoming data from the client to the proxy
   * @param {String} data
   * @param {Net.Socket} proxy
   * @param {Net.Socket|Client} client
   * @returns {Promise}
   */
  static handleFromClient(data, proxy, client) {
    data = data.split('\0')[0]

    return new Promise((resolve) => {
      if (this.isXML(data)) {
        resolve(this.handleXML(data, Direction.IN, client, proxy))
      } else if (this.isXT(data)) {
        resolve(this.handleXT(data, Direction.IN, client, proxy))
      } else if (this.isEncrypted(data)) {
        resolve(this.handleEncryptedData(data, Direction.IN, client, proxy))
      } else {
        resolve(data)
      }
    })
  }
}
