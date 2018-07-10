const redisCache = require('think-cache-redis');
const isDev = think.env === 'development'

module.exports = {
  type: 'redis',
  common: {
    timeout: 72 * 3600 * 1000 // millisecond
  },
  redis: {
    handle: redisCache,
    port: isDev ? 6379 : 6377,
    host: isDev ? '127.0.0.1' : '',
    password: isDev ? '' : ''
  }
}
