const PROXY_CONFIG = [
  {
    context: ['/api', '/oauth2', '/login'],
    target: 'https://city-break-planner.sebastian-fijalkowski.online:8443',
    secure: true,
    logLevel: 'debug'
  }
]

module.exports = PROXY_CONFIG;
