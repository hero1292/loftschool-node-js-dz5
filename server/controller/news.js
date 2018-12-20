const db = require('../database');
const mapper = require('../mappers/news');

exports.Create = (req, res) => {
  db.News
    .create({
      Theme: req.body.theme,
      Text: req.body.text,
      Date: Date.parse(req.body.date),
      UserId: parseInt(req.body.userId)
    })
    .then((news) => {
      res.status(200).send(news);
    }).catch((err) => {
    res.status(500).send(`Error creating news: ${err.message}`);
  });
};

exports.Get = (req, res) => {
  db.News
    .findAll({include: [{association: db.News.User}]})
    .then((newsCollection) => {
      const response = [];
      newsCollection.forEach((news) => {
        response.push(mapper.Map(news))
      });
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(`Error finding news: ${err.message}`);
    });
};

exports.Update = (req, res) => {
  db.News
    .update({
      Theme: req.body.theme,
      Text: req.body.text,
      Date: Date.parse(req.body.date),
      UserId: parseInt(req.body.userId)
    }, {where: {Id: req.params.id}})
    .then((news) => {
      db.News
        .findAll({include: [{association: db.News.User}]})
        .then((newsCollection) => {
          const response = [];
          newsCollection.forEach((news) => {
            response.push(mapper.Map(news))
          });
          res.status(200).send(response);
        })
        .catch((err) => {
          res.status(400).send(`Error finding news: ${err.message}`);
        });
    })
    .catch((err) => {
      res.status(500).send(`Error updating news: ${err.message}`);
    });
};

exports.Delete = (req, res) => {
  db.News
    .destroy({where: {Id: req.params.id}})
    .then((result) => {
      db.News
        .findAll({include: [{association: db.News.User}]})
        .then((newsCollection) => {
          const response = [];
          newsCollection.forEach((news) => {
            response.push(mapper.Map(news))
          });
          res.status(200).send(response);
        })
        .catch((err) => {
          res.status(400).send(`Error finding news: ${err.message}`);
        });
    })
    .catch((err) => {
      res.status(500).send(`Error deleting user: ${err.message}`);
    });
};