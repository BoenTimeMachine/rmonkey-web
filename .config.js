module.exports = {
  http: {
    port: 9709,
    prefix: '/api'
  },
  socket: {
    port: 9710,
    path: '/ws'
  },
  mongo: {
    uri: `mongodb://localhost:47017`,
    name: 'rmonkey'
  },
  auth: {
    autoReg: false
  }
}
