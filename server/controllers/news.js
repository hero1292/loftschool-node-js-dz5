const database = require('../database');

const newsMapper = require('../mappers/news');

exports.Create = (req, res) => {
  database.News
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
  database.News
    .findAll({include: [{association: database.News.User}]})
    .then((newsCollection) => {
      const response = [];
      newsCollection.forEach((news) => {
        response.push(newsMapper.Map(news))
      });
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(`Error finding news: ${err.message}`);
    });
};

exports.Update = (req, res) => {
  database.News
    .update({
      Theme: req.body.theme,
      Text: req.body.text,
      Date: Date.parse(req.body.date),
      UserId: parseInt(req.body.userId)
    }, {where: {Id: req.params.id}})
    .then((news) => {
      database.News
        .findAll({include: [{association: database.News.User}]})
        .then((newsCollection) => {
          const response = [];
          newsCollection.forEach((news) => {
            response.push(newsMapper.Map(news))
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
  database.News
    .destroy({where: {Id: req.params.id}})
    .then((result) => {
      database.News
        .findAll({include: [{association: database.News.User}]})
        .then((newsCollection) => {
          const response = [];
          newsCollection.forEach((news) => {
            response.push(newsMapper.Map(news))
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