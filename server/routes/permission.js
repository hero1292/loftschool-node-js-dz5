module.exports = (router) => {
  const permissionController = require('../controller/permission');
  router.put('/api/updateUserPermission/:id', permissionController.Update);
  return router;
};