'use strict'

const lookup = require('util').promisify(require('dns').lookup)
const fetch = require('node-fetch')

const ProxyLogin = require('./proxy/login')
const ProxyWorld = require('./proxy/world')

const type = process.argv[2]
const target = require('../config/');

(async () => {
  global.logger = require('./utils/logger')

  if (!type || type !== 'login' && type !== 'world') {
    return logger.error('You must provide a valid proxy type.')
  }

  const localIP = await (await lookup(target.dns)).address
  const serverIP = await (await lookup(target.play)).address

  if (localIP !== '127.0.0.1' || serverIP === '127.0.0.1') {
    return logger.error('Please verify that your loopbacks are correct.')
  }

  let xml = await fetch(target.servers)
  xml = await xml.text()

  const config = {
    localIP,
    serverIP, // The magic IP
    loginPort: parseInt(xml.split('port="')[1].split('"')[0]),
    servers: [] // The servers to proxy
  }

  // Set process title to the proxy type
  process.title = type

  if (type === 'login') {
    return new ProxyLogin(config)
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

  for (let i = 0; i < config.servers.length; i++) {
    const serverConfig = config.servers[i]

    // We'll be able to use custom commands in-game, so fuck off with safe servers
    if (!serverConfig.safe) {
      new ProxyWorld(config.localIP, config.serverIP, serverConfig)
    }
  }
})();
