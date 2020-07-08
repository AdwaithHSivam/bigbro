const db = require('../models')

exports.addQuestion = function (ws, msg) {
  if (!msg.body.uid || !msg.body.local_qid) return
  db.question.findOne({
    where: {
      uid: msg.body.uid,
      local_qid: msg.body.local_qid
    }
  }).then((q) => {
    if (q) {
      return q
    } else {
      return db.question.create(msg.body)
    }
  }).then((q) => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'success',
      body: q
    }))
    }).catch((e) => {
    ws.send(JSON.stringify({
      req: msg.req,
      status: 'fail',
      body: {
        local_qid: msg.body.local_qid
      }
    }))
  })
}