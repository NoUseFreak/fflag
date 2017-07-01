var express = require('express');
var router = express.Router();

module.exports = (storage) => {
  router.get('/', (req, res) => {
    storage.getFlags()
      .then((data) => {
        res.json(data);
      }).catch((e) => {
        console.log(e);
        res.status(500);
      });
  });

  router.get('/:id', (req, res) => {
    storage.getFlag(req.params.id)
      .then((data) => {
        if (data === undefined) {
          res.status(404);
        }
        res.json(data);
      });
  });

  router.post('/:id?', (req, res) => {
    const flag = req.body;
    if (req.params.id !== undefined) {
      flag.id = req.params.id;
    }
    storage.getFlag(flag.id)
      .then((data) => {
        if (data === undefined) {
          storage.createFlag(flag)
            .then((data) => {
              res.status(201);
              res.set('Location', `/api/v1/flags/${data.id}`);
              res.json(data);
            });
        } else {
          res.status(409);
          res.json({
            status: 409,
            message: 'Id already in use.'
          })
        }
      });
  });

  router.put('/:id', (req, res) => {
    const flag = req.body;
    storage.getFlag(req.params.id)
      .then((data) => {
        if (data === undefined) {
          res.status(404);
          res.json({
            status: 404,
            message: 'Id not found'
          })
        } else {
          storage.updateFlag(req.params.id, flag)
            .then((data) => {
              res.json(data);
            });
        }
      });
  });

  router.delete('/:id', (req, res) => {
    storage.getFlag(req.params.id)
      .then((data) => {
        if (data === undefined) {
          res.status(404);
          res.json({
            status: 404,
            message: 'Id not found'
          })
        } else {
          storage.deleteFlag(req.params.id)
            .then((data) => {
              res.status(204);
              res.json();
            });
        }
      });
  });

  return router;
};
