if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
console.log(process.env)
const express = require('express')
const db  = require('./models')
const bodyParser = require('body-parser')
const app = express()
const ws = require('./ws')
const port = process.env.PORT || 3000
const auth = require('./auth')


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
  auth.add_user(req.body).then((user) => {//use view style move entirely
    res.json({
      status: 'success',
      body: user
    })
  }).catch(() => {
    res.status(400).end()
  })
})

app.post('/validate/', (req, res) => {
  if (!req.body.username) return res.status(400).end()
  if (!req.body.password) return res.status(400).end()

  auth.validate(
    req.body.username, 
    req.body.password
  ).then((user) => {
    res.json({
      status: 'success',
      body: user
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
}).catch((e) => {
  console.log(e)
})

module.exports = app
