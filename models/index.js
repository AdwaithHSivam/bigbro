const Sequelize = require('sequelize')
const config = require('../config.json').db
const db = {}

let sequelize = new Sequelize(config.database, config.username, config.password, config)

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