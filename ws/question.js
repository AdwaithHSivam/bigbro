const db = require('../models')

exports.getQuestion = function (ws, msg) {
  if (!msg.body.qid) return
  db.question.findOne({
    where: {
      qid: msg.body.qid,
    },
    raw: true
  }).then(q => {
    if (!q) throw Error()
    ws.send(JSON.stringify({
      req: 'get_q',
      body: q
    }))
  }).catch(() => {
    ws.send(JSON.stringify({
      req: 'err_q',
      body: msg.body
    }))
  })
}

exports.addQuestion = function (ws, msg, wss) {
  if (!msg.uid || !msg.body.local_qid) return
  msg.body.uid = msg.uid
  db.question.findOrCreate({
    where: {
      uid: msg.body.uid,
      local_qid: msg.body.local_qid
    },
    defaults: msg.body,
    raw: true
  }).then(q => {
    if (q[1]) {
      wss.sendToAll(JSON.stringify({
        req: 'get_q',
        body: q[0]
      }))
    } else {
      ws.send(JSON.stringify({
        req: 'get_q',
        body: q[0]
      }))
    }
  }).catch(() => {
    ws.send(JSON.stringify({
      req: 'err_q',
      body: msg.body
    }))
  })
}

exports.sendUpdates = function (ws) {
  db.question.findAll({
    attributes: ['qid'],
    limit: 20,
    raw: true
  }).then(qs => {
    ws.send(JSON.stringify({
      req: 'upd_q',
      body: {
        qid: qs.map(q => q.qid)
      }
    }))
  }).catch(() => {})
}