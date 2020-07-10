'use strict'

const Direction = require('../enums/Direction')

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

      logger.debug(`Using ${rndK} for random key.`)
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
    const username = data.split('<nick><![CDATA[')[1].split(']]></nick>')[0]

    logger.debug(`${username} is logging in on the ${serverType} server.`)

    return data
  }
}
