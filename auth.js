const db = require('./models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const privateKey = require("./config.json").jwt.secret

exports.validate = async (username, password) => {//chain this maybe
  user = await db.user.findOne({
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
      username: username,
    }
  })

  if (!user) throw Error()
  success = await bcrypt.compare(password, user.password)
  if (!success) throw Error()
  user = user.toJSON()
  user.password = undefined
  user.jwt = jwt.sign({ uid: user.uid }, privateKey);
  return user
}

exports.add_user = async (body) => {
  pass = await bcrypt.hash(body.password, 8)
  
  user = await db.user.create({
    username: body.username,
    password: pass,
    su: body.su,
    full_name: body.full_name,
    email: body.email,
    mobile: body.mobile,
    photo: ''
  })

  return user
}