'use strict'

/**
 * @exports
 */
module.exports = {
  /**
   * @name cipher
   * @direction OUT
   * @description Intercept the cipher message
   * @param {Array} data
   * @param {Net.Socket} client
   * @param {Net.Socket} proxy
   * @returns {String}
   */
  handleCipher: (dataArr, client, proxy) => {
    Cipher.key = dataArr[2]

    logger.debug(`Cipher key caught: ${Cipher.key}`)

    return dataArr
  }
}
