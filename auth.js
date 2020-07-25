const db = require('./models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const privateKey = process.env.JWT_SECRET

exports.validate = async (username, password) => {//chain this maybe
  let user = await db.user.findOne({
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
    },
    raw: true
  })

  if (!user) throw Error()
  let success = await bcrypt.compare(password, user.password)
  if (!success) throw Error()
  user.password = undefined
  user.jwt = jwt.sign({ uid: user.uid }, privateKey);
  return user
}

exports.add_user = async (body) => {
  let pass = await bcrypt.hash(body.password, 8)
  
  let user = await db.user.create({
    uid: body.uid,
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