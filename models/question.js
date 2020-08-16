const DataTypes = require('sequelize').DataTypes

module.exports = (sequelize) => {
  const  Question = sequelize.define('question', {
      qid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mid: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: 'questions',
    }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'uid'
    })
    Question.belongsTo(models.user, {
      as: 'mentor',
      foreignKey: 'mid'
    })
    Question.hasMany(models.chat, {
      foreignKey: 'qid'
    })
  };

  return Question
}