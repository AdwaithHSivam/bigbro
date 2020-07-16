const db = require('../models')

exports.addQuestion = function (ws, msg) {
  if (!msg.uid || !msg.body.local_qid) return
  msg.body.uid = msg.uid
  db.question.findOrCreate({
    where: {
      uid: msg.body.uid,
      local_qid: msg.body.local_qid
    },
    defaults: msg.body
  }).then(q => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'success',
      body: q[0]
    }))
  }).catch(() => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'fail',
      body: {
        local_qid: msg.body.local_qid
      }
    }))
  })
}

exports.sendUpdates = function (ws, msg) {
  
}