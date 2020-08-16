const DataTypes = require('sequelize').DataTypes

module.exports = (sequelize) => {
  const  Chat = sequelize.define('chat', {
      cid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      qid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'local',
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'local',
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // attach: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   defaultValue: '',
      // }
    },
    {
      tableName: 'chats',
    }
  )

  Chat.associate = (models) => {
    Chat.belongsTo(models.question, {
      foreignKey: 'qid'
    })
    Chat.belongsTo(models.user, {
      foreignKey: 'uid'
    })
  }

  return Chat
}