const WebSocket = require('ws')
const wss = new WebSocket.Server({ 
  noServer: true,
})
const config = require('../config.json').jwt
const db = require('../models')
const jwt = require('jsonwebtoken')

const qApi = require('./question')
const cApi = require('./chat')
const uApi = require('./user')

wss.on('connection',(ws, user) => {

  console.log(`${user.username} is online!`)
  ws.on('close', () => {
    console.log(`${user.username} is offline!`)
  })

  ws.on('message', (msg) => {
    try {
      msg = JSON.parse(msg)
    } catch(e) {
      return
    }
    msg.uid = parseInt(msg.uid)
    if (msg && msg.uid == user.uid) {
      handleMessage(ws, msg, user)
    }
  })
})

function handleMessage(ws, msg, user) {
  if (!msg.body) return
  switch (msg.req) {
    case 'add_q':
      qApi.addQuestion(ws, msg)
      break;

    case 'add_c':
      cApi.addChat(ws, msg)
      break;
    
    case 'get_u':
      uApi.getUser(ws, msg)
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
        return user.toJSON()
      }
      throw Error('Bad Auth')
    }
}



exports.init = function (server) {

  server.on('upgrade', function (req, socket, head) {
    //console.log(req)//to test android stuff
    validate(req.headers).then((user) => {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        ws.user = user
        wss.emit('connection', ws, user)
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
