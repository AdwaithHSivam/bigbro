const express = require('express')
const db  = require('./models')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
const ws = require('./ws')
const port = 3000

const privateKey = require("./config.json").jwt.secret

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json(), (err, req, res, next) => {
  if(err instanceof SyntaxError){
    res.status(400).end()
  } else {
    next()
  }
})

app.post('/user/add', (req, res) => {  
  bcrypt.hash(req.body.password, 8).then((pass) => {
    db.user.create({
      username: req.body.username,
      password: pass,
      su: req.body.su,
      full_name: req.body.full_name,
      email: req.body.email,
      mobile: req.body.mobile,
      photo: ''
    }).then((user) => {
      res.json({
        status: 'success',
        body: user
      })
    }).catch(() => {
      res.status(400).end()
    })
  }).catch(() => {
    res.status(400).end()
  })
})

app.post('/validate/', (req, res) => {
  if (!req.body.username) return res.status(400).end()
  if (!req.body.password) return res.status(400).end()

  db.user.findOne({
    attributes: [
      'uid',
      'password',
      'username',
      'su',
      'full_name',
      'email',
      'mobile',
      'photo'
    ],
    where: {
      username: req.body.username,
    }
  }).then((user) => {
    if (!user) {
      res.status(400).end()
      return
    }
    bcrypt.compare(req.body.password, user.password)
    .then((isSuccess) => {
      if (isSuccess) {
        user.password = undefined
        user.dataValues.jwt = jwt.sign({ uid: user.uid }, privateKey);
        res.json({
          status: 'success',
          body: user
        })
      } else {
        res.status(400).end()
      }
    }).catch(() => {
      res.status(400).end()
    })
  }).catch(() => {
    res.status(400).end()
  })
})

app.use(express.static('app/public'))

app.get('/', (req, res) => res.send('OK'))

db.sequelize.sync().then(() => {
  let server = app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`))
  ws.init(server)
})

module.exports = app
