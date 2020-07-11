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
   * @returns {Array}
   */
  handleCipher: (dataArr, client, proxy) => {
    Cipher.key = dataArr[2]
    Cipher.mask = Cipher.encrypt('%xt%')

    Logger.debug(`Cipher key caught: ${Cipher.key}`)

    return dataArr
  }
}
