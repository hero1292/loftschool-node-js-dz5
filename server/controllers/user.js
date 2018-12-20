const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const config = require('../config');
const database = require('../database');

const userMapper = require('../mappers/user');

exports.Get = (req, res) => {
  database.User
    .findAll({include: [{association: database.User.Permission}]})
    .then((users) => {
      const response = [];
      users.forEach(user => {
        response.push(userMapper.Map(user))
      });
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(`Error finding users: ${err.message}`);
    });
};

exports.Update = (req, res) => {

  console.log(`Updating user ${req.params.id}`);
  database.User
    .findOne({where: {Id: req.params.id}, include: [{association: database.User.Permission}]})
    .then((user) => {
      console.log(`Found user: ${JSON.stringify(user)}`);
      const mappedUser = userMapper.Map(user);
      console.log(`Mapped user: ${JSON.stringify(mappedUser)}`);
      const changedFields = req.body;
      console.log(`Changed fields: ${JSON.stringify(changedFields)}`);
      Object.keys(changedFields).forEach(fieldName => {
        console.log(`Set User.${fieldName} to ${changedFields[fieldName]}`);
        if (fieldName === 'password')
          mappedUser[fieldName] = bcrypt.hashSync(changedFields[fieldName], 8);
        else mappedUser[fieldName] = changedFields[fieldName];
      });
      console.log(`Updating user: ${JSON.stringify(mappedUser)}`);
      database.User
        .update({
          FirstName: mappedUser.firstName,
          LastName: mappedUser.surName,
          MiddleName: mappedUser.middleName,
          Password: mappedUser.password
        }, {where: {Id: mappedUser.id}})
        .then((result) => {
          mappedUser['access_token'] = jwt.sign({id: mappedUser.Id}, config.authSecret, {expiresIn: 86400});
          res.status(200).send(mappedUser);
        })
        .catch((err) => {
          res.status(500).send(`Error updating user: ${err.message}`);
        });
    })
    .catch((err) => {
      res.status(400).send(`Error finding user: ${err.message}`);
    });
};

exports.Delete = (req, res) => {
  database.User.findOne({where: {id: req.params.id}})
    .then((user) => {
      if (user) {
        user.destroy()
          .then((result) => {
            res.status(200).send(result)
          })
          .catch((err) => {
            res.status(500).send(`Error deleting user: ${err.message}`);
          });
      }
    });
};

exports.SaveAvatar = (req, res) => {
  const avatarPath = path.join('./assets/img/avatars', req.file.filename);
  database.User
    .update({Avatar: avatarPath}, {where: {Id: req.params.id}})
    .then((result) => {
      const response = {path: avatarPath};
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(`Error updating user avatar: ${err.message}`);
    });
};