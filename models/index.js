const Sequelize = require('sequelize')
const db = {}

let sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  dialect: process.env.RDS_DIALECT || 'mysql',
  port: process.env.RDS_PORT
})

db.user = require('./user')(sequelize, Sequelize.DataTypes)
db.question = require('./question')(sequelize, Sequelize.DataTypes)
db.chat = require('./chat')(sequelize, Sequelize.DataTypes)


Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db