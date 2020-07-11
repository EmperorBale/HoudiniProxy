'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Cipher {
  /**
   * @static
   * The cipher key
   * @type {String}
   */
  static key = ''
  /**
   * @static
   * The cipher base
   * @type {String}
   */
  static base = 'qwertyuiopasdfghjklzxcvbnm1234567890%|?><:!&()'
  /**
   * @static
   * The cipher mask
   * @type {String}
   */
  static mask = ''

  /**
   * @static
   * Returns whether the Cipher is active or not
   * @returns {Boolean}
   */
  static active() {
    return this.key !== ''
  }

  /**
   * @static
   * Returns whether the given data has the Cipher mask
   * @param {String} data
   * @returns {Boolean}
   */
  static hasMask(data) {
    return data.substring(0, 4) === this.mask
  }

  /**
   * @static
   * Encrypts a string
   * @param {String} str
   * @returns {String}
   */
  static encrypt(str) {
    let res = ''

    for (let i = 0; i < str.length; i++) {
      const chr = this.base.indexOf(str.charAt(i))

      res += chr <= 0 ? str.charAt(i) : this.key.charAt(chr)
    }

    return res
  }

  /**
   * @static
   * Decrypts a string
   * @param {String} str
   * @returns {String}
   */
  static decrypt(str) {
    let res = ''

    for (let i = 0; i < str.length; i++) {
      const chr = this.base.charAt(this.key.indexOf(str.charAt(i)))

      res += chr === '' ? str.charAt(i) : chr
    }

    return res
  }
}
