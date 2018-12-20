const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const jimp = require('jimp');
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];
const db = require('../db');
const mapper = require('../maps/user');

exports.Get = (req, res) => {
  db.User
    .findAll({include: [{association: db.User.Permission}]})
    .then((users) => {
      const response = [];
      users.forEach(user => {
        response.push(mapper.Map(user))
      });
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(`Error finding users: ${err.message}`);
    });
};

exports.Update = (req, res) => {

  console.log(`Updating user ${req.params.id}`);
  db.User
    .findOne({where: {Id: req.params.id}, include: [{association: db.User.Permission}]})
    .then((user) => {
      console.log(`Found user: ${JSON.stringify(user)}`);
      const mappedUser = mapper.Map(user);
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
      db.User
        .update({
          FirstName: mappedUser.firstName,
          LastName: mappedUser.surName,
          MiddleName: mappedUser.middleName,
          Password: mappedUser.password
        }, {where: {Id: mappedUser.id}})
        .then(() => {
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
  db.User.findOne({where: {id: req.params.id}})
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
  const resizeAvatar = path.join('./dist/assets/img/avatars', req.file.filename);
  db.User
    .update({Avatar: avatarPath}, {where: {Id: req.params.id}})
    .then(() => {
      jimp.read(resizeAvatar, (err, image) => {
        if (err) throw err;
        image.resize(250, 250)
          .quality(50)
          .write(resizeAvatar);
      });
      const response = {path: avatarPath};
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(`Error updating user avatar: ${err.message}`);
    });
};