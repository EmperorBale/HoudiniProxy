'use strict'

const readdir = require('util').promisify(require('fs').readdir)
const Direction = require('../enums/Direction')

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
    rndK: {
      functionName: 'handleRandomKey',
      direction: Direction.BOTH
    },
    login: {
      functionName: 'handleLogin',
      direction: Direction.IN
    }
  }
  /**
   * @static
   * @private
   * The XML handlers
   * @type {Object}
   */
  static #xmlHandlers = {
    handleRandomKey: 'rndK',
    handleLogin: 'login'
  }

  /**
   * @static
   * Loads the XML handlers
   * @returns {Promise}
   */
  static loadXML() {
    return new Promise((resolve, reject) => {
      const dir = `${process.cwd()}/src/proxy/handlers`

      readdir(dir).then((handlers) => {
        for (let i = 0; i < handlers.length; i++) {
          const [fileName, fileType] = handlers[i].split('.')

          if (fileType === 'js') {
            const handler = require(`${dir}/${fileName}`)
            const functionNames = Object.keys(handler)

            for (let i = 0; i < functionNames.length; i++) {
              const functionName = functionNames[i]

              if (this.#xmlHandlers[functionName]) {
                const action = this.#xmlHandlers[functionName]

                if (this.xmlHandlers[action]) {
                  const xml = this.xmlHandlers[action]

                  if (xml.functionName === functionName) {
                    xml.callback = handler[functionName]
                  } else {
                    throw `Unmatching XML function name: '${functionName}'-'${xml.functionName}'.`
                  }
                } else {
                  throw `Unknown XML action: '${action}'.`
                }
              } else {
                throw `Unknown XML function name: '${functionName}'.`
              }
            }
          }
        }

        resolve()
      }).catch((err) => reject(err))
    })
  }

  /**
   * @static
   * Returns whether the data is XML or not
   * @param {String} data
   * @returns {Boolean}
   */
  static isXML(data) {
    return data.charAt() === '<' && data.charAt(data.length - 1) === '>'
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
   * Handles XML data
   * @param {String} data
   * @param {String} origin
   * @param {Net.Socket} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  static handleXML(data, origin, client, proxy) {
    // This is so epic!
    const action = origin === Direction.IN
      ? data.split(`='`)[2].split(`'`)[0]
      : data.split('="')[2].split('"')[0]

    if (this.xmlHandlers[action]) {
      const { direction, callback } = this.xmlHandlers[action]

      if (direction === origin || direction === Direction.BOTH) {
        if (direction === Direction.BOTH) {
          data = callback(data, origin, client, proxy)
        } else {
          data = callback(data, client, proxy)
        }
      }
    }

    return data
  }

  /**
   * @static
   * Handles XT data
   * @param {String} data
   * @param {String} origin
   * @param {Net.Socket} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  static handleXT(data, origin, client, proxy) {
    return data
  }

  /**
   * @static
   * Handles outgoing data from the proxy to the client
   * @param {String} data
   * @param {Net.Socket} client
   * @param {Net.Proxy} proxy
   * @returns {Promise}
   */
  static handleFromProxy(data, client, proxy) {
    data = data.split('\0')[0]

    return new Promise((resolve) => {
      if (this.isXML(data) && data.indexOf('<body action=') !== -1) {
        resolve(this.handleXML(data, Direction.OUT, client, proxy))
      } else if (this.isXT(data)) {
        resolve(this.handleXT(data, Direction.OUT, client, proxy))
      } else {
        resolve(data)
      }
    })
  }

  /**
   * @static
   * Handles incoming data from the client to the proxy
   * @param {String} data
   * @param {Net.Socket} proxy
   * @param {Net.Socket} client
   * @returns {Promise}
   */
  static handleFromClient(data, proxy, client) {
    data = data.split('\0')[0]

    return new Promise((resolve) => {
      if (this.isXML(data) && data.indexOf('<body action=') !== -1) {
        resolve(this.handleXML(data, Direction.IN, client, proxy))
      } else if (this.isXT(data)) {
        resolve(this.handleXT(data, Direction.IN, client, proxy))
      } else {
        resolve(data)
      }
    })
  }
}
