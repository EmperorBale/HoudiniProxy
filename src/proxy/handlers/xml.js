'use strict'

const Direction = require('../enums/Direction')
const ServerType = require('../enums/ServerType')

/**
 * @exports
 */
module.exports = {
  /**
   * @name rndK
   * @direction BOTH
   * @description Intercept the rndK message
   * @param {String} data
   * @param {String} direction
   * @param {Net.Socket} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  handleRandomKey: (data, direction, client, proxy) => {
    if (direction === Direction.OUT) {
      const rndK = data.split('<k>')[1].split('</k>')[0]

      Logger.debug(`Using ${rndK} for random key.`)
    }

    return data
  },
  /**
   * @name login
   * @direction IN
   * @description Intercept the login message
   * @param {String} data
   * @param {Net.Socket} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  handleXMLLogin: (data, client, proxy) => {
    if (serverType === ServerType.LOGIN) {
      const username = data.split('<nick><![CDATA[')[1].split(']]></nick>')[0]

      Logger.debug(`${username} is logging in.`)
    }

    return data
  }
}
