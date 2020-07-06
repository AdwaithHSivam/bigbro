const express = require('express')
const db  = require('./models')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
const ws = require('./ws')
const port = 3000

const privateKey = require("./config.json").jwt.secret


app.use(bodyParser.json())

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
      return res.json({
        status: 'success',
        body: user
      })
    }).catch((e) => {
      return res.json({
        status: 'fail',
        err: e
      })
    })
  }).catch((e) => {
    return res.json({
      status: 'fail',
      err: e
    })
  })
})

app.post('/validate/', (req, res) => {
  console.log(req.body)
  if (!req.body.username) return res.json({
    status : 'bad request'
  })
  if (!req.body.password) return res.json({
    status : 'bad request'
  })
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
    if (!user) return res.json({
      status : 'invalid auth'
    })
    bcrypt.compare(req.body.password, user.password)
    .then((isSuccess) => {
      if (isSuccess){
        user.password = undefined
        user.dataValues.jwt = jwt.sign({ uid: user.uid }, privateKey);
        return res.json({
          status: 'success',
          body: user
        })
      } else {
        return res.json({
          status : 'invalid auth'
        })
      }
      
    }).catch((e) =>{
      console.log(e)
      return res.json({
        status: 'fail',
        err: JSON.stringify(e)
      })
    })
  })
})
app.use(express.static('app/public'))


app.get('/', (req, res) => res.send('OK'))

db.sequelize.sync().then(() => {
  let server = app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`))
  ws.init(server)
})

module.exports = app
