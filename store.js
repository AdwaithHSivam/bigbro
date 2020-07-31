const { v4: uuidv4 } = require('uuid')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const auth = require('./auth')

const s3 = new aws.S3()

const upload = multer({
  fileFilter: (req, file, cb)  => {
    auth.verifyJwt(req.body.jwt)
    .then(user => {
      cb(null, true)
    }).catch(() => {
      cb(null, false)
    })
  },
  storage: multerS3({
    s3: s3,
    bucket: 'bigbro-test-bucket',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, uuidv4())
    }
  })
})

module.exports = upload