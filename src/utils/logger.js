'use strict'

const { createLogger, transports, format, addColors } = require('winston')
const { combine, colorize, timestamp, json, printf } = format

require('winston-daily-rotate-file')
addColors({ incoming: 'bold white cyanBG', outgoing: 'bold white yellowBG' })

/**
 * The text formatter
 * @param {String} level
 * @param {String} message
 * @param {String} timestamp
 * @returns {String}
 */
const textFormat = printf(({ level, message, timestamp }) => {
  return `[\x1b[36m${timestamp}\x1b[0m] [${level}] \x1b[35m>\x1b[0m ${message}`
})

/**
 * The debug logger
 * @type {Object}
 */
const { debug } = createLogger({
  levels: { debug: 7 },
  transports: [
    new transports.DailyRotateFile({
      level: 'debug',
      maxFiles: '1d',
      filename: `./logs/${process.argv[2]}/debug@%DATE%.log`,
      datePattern: 'D-M-YYYY',
      format: combine(timestamp({ format: 'HH:mm:ss' }), json())
    }),
    new transports.Console({
      level: 'debug',
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), textFormat)
    })
  ]
})

/**
 * The info logger
 * @type {Object}
 */
const { info } = createLogger({
  levels: { info: 6 },
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      maxFiles: '2d',
      filename: `./logs/${process.argv[2]}/info@%DATE%.log`,
      datePattern: 'D-M-YYYY',
      format: combine(timestamp({ format: 'HH:mm:ss' }), json())
    }),
    new transports.Console({
      level: 'info',
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), textFormat)
    })
  ]
})

/**
 * The warn logger
 * @type {Object}
 */
const { warn } = createLogger({
  levels: { warn: 4 },
  transports: [
    new transports.DailyRotateFile({
      level: 'warn',
      maxFiles: '3d',
      filename: `./logs/${process.argv[2]}/warn@%DATE%.log`,
      datePattern: 'D-M-YYYY',
      format: combine(timestamp({ format: 'HH:mm:ss' }), json())
    }),
    new transports.Console({
      level: 'warn',
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), textFormat)
    })
  ]
})

/**
 * The error logger
 * @type {Object}
 */
const { error } = createLogger({
  levels: { error: 3 },
  transports: [
    new transports.DailyRotateFile({
      level: 'error',
      maxFiles: '4d',
      filename: `./logs/${process.argv[2]}/error@%DATE%.log`,
      datePattern: 'D-M-YYYY',
      format: combine(timestamp({ format: 'HH:mm:ss' }), json())
    }),
    new transports.Console({
      level: 'error',
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), textFormat)
    })
  ]
})

/**
 * The incoming logger
 * @type {Object}
 */
const { incoming } = createLogger({
  levels: { incoming: 6 },
  transports: [
    new transports.DailyRotateFile({
      level: 'incoming',
      maxFiles: '1d',
      filename: `./logs/${process.argv[2]}/incoming@%DATE%.log`,
      datePattern: 'D-M-YYYY',
      format: combine(timestamp({ format: 'HH:mm:ss' }), json())
    }),
    new transports.Console({
      level: 'incoming',
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), textFormat)
    })
  ]
})

/**
 * The outgoing logger
 * @type {Object}
 */
const { outgoing } = createLogger({
  levels: { outgoing: 6 },
  transports: [
    new transports.DailyRotateFile({
      level: 'outgoing',
      maxFiles: '1d',
      filename: `./logs/${process.argv[2]}/outgoing@%DATE%.log`,
      datePattern: 'D-M-YYYY',
      format: combine(timestamp({ format: 'HH:mm:ss' }), json())
    }),
    new transports.Console({
      level: 'outgoing',
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), textFormat)
    })
  ]
})

/**
 * @exports
 */
module.exports = {
  debug: (msg) => debug(msg),
  info: (msg) => info(msg),
  warn: (msg) => warn(msg),
  error: (msg) => error(msg),
  incoming: (msg) => incoming(msg),
  outgoing: (msg) => outgoing(msg)
}
