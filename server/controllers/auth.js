const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');
const database = require('../database');

const userMapper = require('../mappers/user');

exports.Register = (req, res) => {
  console.log(`Permission: ${JSON.stringify(req.body.permission)}`);
  database.User
    .create({
      Name: req.body.username,
      Password: bcrypt.hashSync(req.body.password, 8),
      FirstName: req.body.firstName,
      LastName: req.body.surName,
      MiddleName: req.body.middleName,
      Avatar: req.body.img,
      Permission: req.body.permission
    }, {include: [{association: database.User.Permission}]})
    .then((user) => {
      const response = userMapper.Map(user);
      response['access_token'] = jwt.sign({id: user.Id}, config.authSecret, {expiresIn: 86400}); // expires in 24 hours;
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(`Register user error: ${err.message}`)
    })
};

exports.Login = (req, res) => {
  console.log(`Passed username: ${req.body.username}`);
  database.User
    .findOne({include: [{association: database.User.Permission}], where: {Name: req.body.username}})
    .then((user) => {
      if (!user)
        return res.status(400).send('No user found');
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.Password);
      if (!passwordIsValid)
        return res.status(401).send('Password not valid');

      const response = userMapper.Map(user);
      response['access_token'] = jwt.sign({id: user.Id}, config.authSecret, {expiresIn: 86400});
      return res.status(200).send(response);
    })
    .catch((err) => {
      return res.status(400).send(`Error finding user: ${err.message}`);
    })
};

exports.AuthFromToken = (req, res) => {
  let accessToken = req.body.access_token;

  accessToken = accessToken.substr(1, accessToken.length - 2);
  if (!accessToken) return res.status(400).send({error: 'Access token is not defined in cookie'});

  const decodedToken = jwt.decode(accessToken, config.authSecret);
  if (!decodedToken) return res.status(400).send({error: 'Could not decode access token'});

  database.User.findOne({where: {id: decodedToken.id}})
    .then((user) => {
      if (!user) return res.status(400).send({error: 'User not found'});
      req.session.accessToken = accessToken;
      res.send(user);
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
};