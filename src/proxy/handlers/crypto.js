'use strict'

/**
 * @exports
 */
module.exports = {
  /**
   * Sets up the cipher class
   * @param {Array} data
   * @param {String} direction
   * @param {Client} client
   * @param {Net.Socket} proxy
   * @returns {Array}
   */
  handleCipher: (dataArr, direction, client, proxy) => {
    Cipher.key = dataArr[2]
    Cipher.mask = Cipher.encrypt('%xt%')

    Logger.debug(`Cipher key caught: ${Cipher.key}`)

    return dataArr
  }
}
