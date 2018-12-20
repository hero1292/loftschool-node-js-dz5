module.exports = (router) => {
  const newsController = require('../controllers/news');
  router.get('/api/getNews', newsController.Get);
  router.post('/api/newNews', newsController.Create);
  router.put('/api/updateNews/:id', newsController.Update);
  router.delete('/api/deleteNews/:id', newsController.Delete);
  return router;
};