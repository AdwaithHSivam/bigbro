const db = require('../models')

exports.getUser = function (ws, msg) {
  if (!msg.body.uid) return
  db.user.findOne({
    attributes: ['username', 'uid'],
    where: {
      uid: msg.body.uid,
    },
    raw: true
  }).then(user => {
    if (!user) throw Error()
    ws.send(JSON.stringify({
      req: 'get_u',
      body: user
    }))
  }).catch(() => {
    ws.send(JSON.stringify({
      req: 'err_u',
      body: msg.body
    }))
  })
}