module.exports = (router) => {
  const permissionController = require('../controllers/permission');
  router.put('/api/updateUserPermission/:id', permissionController.Update);
  return router;
};