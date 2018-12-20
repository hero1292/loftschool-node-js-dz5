module.exports = function (sequelize, DataTypes) {
  return sequelize.define('news', {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    Theme: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'theme'
    },
    Text: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'text'
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'date'
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    }
  });
};