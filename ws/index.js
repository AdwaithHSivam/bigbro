const WebSocket = require('ws')
const wss = new WebSocket.Server({ noServer: true })
const config = require('../config.json').jwt
const db = require('../models')
const jwt = require('jsonwebtoken')

const qApi = require('./question')

wss.on('connection',(ws, req) => {
    console.log('hello')
  ws.on('message', (msg) => {
    try {
      msg = JSON.parse(msg)
    } catch(e) {
      return
    }
    if (msg && msg.jwt) {
      try{
        decoded = jwt.verify(msg.jwt, config.secret)
      } catch (e){
        return
      }
      db.user.findOne({
        where: {
          uid: decoded.uid
        }
      }).then((user) =>{
        if(user){
          handleMessage(ws, msg, user.toJSON())
        }
      }).catch((e) => {
        console.log(e)
      })
    } else {
      ws.send(JSON.stringify({ // kinda unnecessary
        status: 'fail',
        e: 'bad request'
      }))
    }
    
  })
})

function handleMessage(ws, msg, user) {
  if (!msg.body) return
  msg.body.uid = user.uid
  switch (msg.req) {
    case 'add_q': qApi.addQuestion(ws, msg, user)
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
      // console.log(user)
      if(user){
        return
      }
      throw Error('Bad Auth')
    }
}



exports.init = function (server) {

  server.on('upgrade', function (req, socket, head) {
    //console.log(req)
    console.log(req.headers)
    validate(req.headers).then(() => {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req)
      })
    }).catch((e) => {
      console.log(e)
      socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n')
      socket.end()
      socket.destroy()
      return
    })
    
  })
      
}
