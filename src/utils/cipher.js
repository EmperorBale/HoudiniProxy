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
   * Encrypts a string
   * @param {String} str
   * @returns {String}
   */
  static encrypt(str) {
    let res = ''

    for (let i = 0; i < str.length; i++) {
      res += this.base.indexOf(str.charAt(i)) < 0 ? str.charAt(i) : this.key.charAt(this.base.indexOf(str.charAt(i)))
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
      res += this.base.charAt(this.key.indexOf(str.charAt(i)))
    }

    return res
  }
}
