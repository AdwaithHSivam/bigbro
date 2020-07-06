const DataTypes = require('sequelize').DataTypes

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
      uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      su: {
        type: DataTypes.INTEGER,// 0 for admin 1 for mentor 2 for user
        allowNull: false,
        defaultValue: 2,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: 'users',
    }
  );

  User.associate = (models) => {
    User.hasMany(models.question, {
      as: 'questions',
      foreignKey: 'uid'
    })
    User.hasMany(models.question, {
      as: 'attendedQuestions',
      foreignKey: 'mid'
    })
  }

  return User
}