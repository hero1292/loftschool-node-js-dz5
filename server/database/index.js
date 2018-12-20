const path = require('path');
const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: false
    },
    define: {
      timestamps: false
    }
  }
);

// const sequelize = new Sequelize('test', 'postgres', '12345', {
//   host: 'localhost',
//   dialect: 'postgres',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });

sequelize.sync();
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const models = [
  'User',
  'News',
  'Permission'
];
models.forEach((model) => {
  const modelPath = path.resolve(path.join(__dirname, '../models', model.toLowerCase()));
  console.log(`Model path: ${modelPath}`);
  module.exports[model] = require(modelPath)(sequelize, Sequelize);
});

((m) => {
  m.News.User = m.News.belongsTo(m.User, {as: 'User'});
  m.User.Permission = m.User.belongsTo(m.Permission, {as: 'Permission'});
})(module.exports);

module.exports.sequelize = sequelize;