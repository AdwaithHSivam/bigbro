const db = require('../models')

exports.addChat = function (ws, msg) {
  if (!msg.uid || !msg.body.qid || !msg.body.local_cid) return
  msg.body.uid = msg.uid
  db.chat.findOrCreate({
    where: {
      uid: msg.body.uid,
      local_cid: msg.body.local_cid
    },
    defaults: msg.body
  }).then(c => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'success',
      body: c[0]
    }))
  }).catch(() => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'fail',
      body: {
        local_cid: msg.body.local_cid
      }
    }))
  })
}