const db = require('../models')

exports.getUser = function (ws, msg) {
  if (!msg.body.uid) return
  db.user.findOne({
    where: {
      uid: msg.body.uid,
    }
  }).then(user => {
    if (!user) throw Error()
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'success',
      body: {
        uid: user.uid,
        username: user.username,
      }
    }))
  }).catch(() => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'fail',
      body: {
        uid: msg.body.uid
      }
    }))
  })
}