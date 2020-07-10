'use strict'

/**
 * @exports
 */
module.exports = {
  /**
   * @name l
   * @direction OUT
   * @description Intercept the login message
   * @param {Array} data
   * @param {Net.Socket} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  handleXTLogin: (dataArr, client, proxy) => {
    return dataArr
  }
}
