const WebSocket = require('ws')
const wss = new WebSocket.Server({ noServer: true })
const config = require('../config.json').jwt
const db = require('../models')
const jwt = require('jsonwebtoken')

const qApi = require('./question')

wss.on('connection',(ws, uid) => {

  ws.on('message', (msg) => {
    try {
      msg = JSON.parse(msg)
    } catch(e) {
      return
    }
    msg.uid = parseInt(msg.uid)
    if (msg && msg.uid == uid) {
      handleMessage(ws, msg, uid)
    }
  })
})

function handleMessage(ws, msg, uid) {
  if (!msg.body) return
  msg.body.uid = uid
  switch (msg.req) {
    case 'add_q': 
      qApi.addQuestion(ws, msg)
      break;
  
    default:
      break;
  }
}

async function validate(headers) {
  var header = headers['sec-websocket-protocol']
    var raw = JSON.parse(header)
    if (raw[0] == 'access_token'){
      decoded = jwt.verify(raw[1], config.secret)
      user = await db.user.findOne({
        where: {
          uid: decoded.uid
        }
      })
      if(user){
        return user.uid
      }
      throw Error('Bad Auth')
    }
}



exports.init = function (server) {

  server.on('upgrade', function (req, socket, head) {
    console.log(req)//to test android stuff
    validate(req.headers).then((uid) => {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, uid)
      })
    }).catch((e) => {
      socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n')
      socket.end()
      socket.destroy()
    })
    
  })
      
}
