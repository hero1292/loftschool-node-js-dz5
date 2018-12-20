module.exports = (router) => {
  const userController = require('../controllers/user');
  router.get('/api/getUsers', userController.Get);
  router.put('/api/updateUser/:id', userController.Update);
  router.delete('/api/deleteUser/:id', userController.Delete);

  const upload = require('../utils/upload');
  router.post('/api/saveUserImage/:id', upload.single('image'), userController.SaveAvatar);
  return router;
};