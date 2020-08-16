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
  if (!msg.uid || !msg.body.uuid) return
  msg.body.uid = msg.uid
  db.question.findOrCreate({
    where: {
      uid: msg.body.uid,
      uuid: msg.body.uuid
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

exports.acceptQ = function (ws, msg, wss) {
  if (!msg.uid || !msg.body.qid) return
  if (ws.user.su == 2) return
  db.question.update({mid: msg.uid},{ 
    where: {
      qid: msg.body.qid,
      mid: null
    }
  }).then(ret => {
    if (ret[0] == 0) throw Error()
    return db.question.findByPk(msg.body.qid)
  }).then(q => {
    wss.sendToAll(JSON.stringify({
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

exports.closeQ = function (ws, msg, wss) {
  if (!msg.uid || !msg.body.qid) return
  db.question.update({status: 1},{ 
    where: {
      qid: msg.body.qid,
      uid: msg.uid
    }
  }).then(ret => {
    if (ret[0] == 0) throw Error()
    return db.question.findByPk(msg.body.qid)
  }).then(q => {
    wss.sendToAll(JSON.stringify({
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