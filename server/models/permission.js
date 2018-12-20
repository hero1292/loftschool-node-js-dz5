module.exports = function (sequelize, DataTypes) {
  return sequelize.define('permissions', {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    Value: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        setting: {
          C: false, R: true, U: false, D: false
        },
        chat: {
          C: false, R: true, U: false, D: false
        },
        news: {
          C: false, R: true, U: false, D: false
        }
      },
      field: 'permission'
    }
  })
};