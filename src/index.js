'use strict'

const lookup = require('util').promisify(require('dns').lookup)
const fetch = require('node-fetch')

const ProxyLogin = require('./proxy/login')
const ProxyWorld = require('./proxy/world')

global.serverType = process.argv[2]
const target = require('../config/');

(async () => {
  global.Logger = require('./utils/logger')
  global.Cipher = require('./utils/cipher')

  if (!serverType || serverType !== 'login' && serverType !== 'world') {
    return Logger.error('You must provide a valid proxy type.')
  }

  const localIP = await (await lookup(target.dns)).address
  const serverIP = await (await lookup(target.play)).address

  if (localIP !== '127.0.0.1' || serverIP === '127.0.0.1') {
    return Logger.error('Please verify that your loopbacks are correct.')
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
  process.title = serverType

  if (serverType === 'login') {
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

    // We want to be able to use custom commands in-game, so fuck off with safe servers
    if (!serverConfig.safe) {
      new ProxyWorld(config.localIP, config.serverIP, serverConfig)
    }
  }
})();
