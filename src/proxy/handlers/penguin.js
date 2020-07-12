'use strict'

/**
 * @exports
 */
module.exports = {
  /**
   * Sets our client
   * @param {Array} dataArr
   * @param {String} direction
   * @param {Client} client
   * @param {Net.Socket} proxy
   * @returns {Array}
   */
  handleLoadPenguin: (dataArr, direction, client, proxy) => {
    const [id, username] = dataArr[2].split('|')

    if (client.id === 0) {
      client.id = parseInt(id)
      client.username = username

      Logger.debug('Caught id and username.')
    }

    return dataArr
  },
  /**
   * Handles commands
   * @param {Array} dataArr
   * @param {String} direction
   * @param {Client} client
   * @param {Net.Socket} proxy
   * @returns {Array}
   */
  handleSendMessage: (dataArr, direction, client, proxy) => {
    const id = parseInt(dataArr[2])
    const message = dataArr[3]

    if (client.id === id && message.charAt() === '/') {
      // Todo
    }

    return dataArr
  }
}
