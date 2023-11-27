const PROXY_CONFIG = [
  {
    context: ['/api', '/oauth2', '/login'],
    target: 'http://city-break-planner.sebastian-fijalkowski.online:8080',
    secure: true,
    logLevel: 'debug'
  }
]

module.exports = PROXY_CONFIG;
