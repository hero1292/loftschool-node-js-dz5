module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'login'
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password'
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    MiddleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'middle_name'
    },
    Avatar: {
      type: DataTypes.STRING,
      field: 'img'
    },
    PermissionId: {
      type: DataTypes.INTEGER,
      field: 'permission_id'
    }
  });
};