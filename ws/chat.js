const db = require('../models')

exports.getChats = function (ws, msg) {
  if (!msg.body.qid) return
  db.chat.findAll({
    where: {
      qid: msg.body.qid,
    },
    raw: true
  }).then(chats => {
    chats.map(chat => {
      ws.send(JSON.stringify({
        req: 'get_c',
        body: chat
      }))
    })
  }).catch(() => {
    ws.send(JSON.stringify({
      req: 'err_c',
      body: msg.body
    }))
  })
}

exports.addChat = function (ws, msg, wss) {
  if (!msg.uid || !msg.body.qid || !msg.body.local_cid) return
  msg.body.uid = msg.uid
  db.question.findByPk(msg.body.qid, {
    raw: true,
  }).then(q => {
    if (!q) throw Error()
    if (q.uid === msg.uid) uid2 = q.mid
    else if (q.mid === msg.uid) uid2 = q.uid
    else throw Error()
    return Promise.all([uid2,
      db.chat.findOrCreate({
        where: {
          uid: msg.body.uid,
          local_cid: msg.body.local_cid
        },
        defaults: msg.body,
        raw: true
      })
    ])
  }).then((ret) => {
    let uid2 = ret[0], c = ret[1]
    let res = JSON.stringify({
      req: 'get_c',
      body: c[0]
    })
    ws.send(res)
    if (c[1] && uid2) {
      wss.sendToUsers([uid2], res)
    }
  }).catch(() => {
    ws.send(JSON.stringify({
      req: 'err_c',
      body: msg.body
    }))
  })
}