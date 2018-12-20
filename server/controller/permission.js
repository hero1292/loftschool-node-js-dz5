const db = require('../db');

exports.Update = (req, res) => {
  db.Permission
    .findOne({where: {Id: req.params.id}})
    .then((permission) => {
      if (!permission)
        return res.status(400).send('Permission not found');

      const changedPermissions = req.body.permission;

      console.log(`changedPermissions: ${JSON.stringify(changedPermissions)}`);

      Object.keys(changedPermissions).forEach(pkey => {
        console.log(`Key: ${pkey}`);
        const ops = changedPermissions[pkey];
        Object.keys(ops).forEach((okey) => {
          console.log(`Set ${pkey}.${okey} to ${ops[okey]}`);
          permission.Value[pkey][okey] = ops[okey];
        });
      });

      db.Permission
        .update({Value: permission.Value}, {where: {Id: permission.Id}})
        .then((result) => {
          res.status(200).send(result);
        })
        .catch(err => {
          res.status(500).send(`Error saving new permissions: ${err.message}`)
        })
    })
    .catch((err) => {
      res.status(500).send(`Error updating user permission: ${err.message}`);
    });
};