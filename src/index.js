'use strict'

const lookup = require('util').promisify(require('dns').lookup)
const fetch = require('node-fetch');

(async () => {
  global.logger = require('./utils/logger')

  const localIP = await (await lookup('newcp.net')).address
  const serverIP = await (await lookup('play.newcp.net')).address

  if (localIP !== '127.0.0.1') {
    logger.error('You must add the loopback of newcp.net.')
  }

  if (serverIP === '127.0.0.1') {
    logger.error('You must remove the loopback of play.newcp.net.')
  }

  let xml = await fetch('https://play.newcp.net/servers.xml')
  xml = await xml.text()

  const config = {
    localIP,
    serverIP, // The magic
    loginPort: parseInt(xml.split('port="')[1].split('"')[0]),
    servers: [] // The servers to proxy
  }

  xml = xml.split('id="')
  xml.shift() // We don't care about this anymore

  for (let i = 0; i < xml.length; i++) {
    const serverConfig = xml[i]

    // I hate Node.js XML parsers
    config.servers[config.servers.length] = {
      id: parseInt(serverConfig.split('"')[0]),
      name: serverConfig.split('name="')[1].split('"')[0],
      safe: serverConfig.split('safe="')[1].split('"')[0] !== 'false',
      port: parseInt(serverConfig.split('port="')[1].split('"')[0])
    }
  }
})();
