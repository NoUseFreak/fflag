var express = require('express');
var router = express.Router();

module.exports = (storage) => {
  router.get('/', (req, res) => {
    console.log(storage.getFlagsAsync())
    storage.getFlagsAsync().then((data) => {
      res.json(data);
    }).catch((e) => {
      console.log(e);
      res.status(500);
    });
  });

  router.get('/:id', (req, res) => {
    res.json(storage.getFlag(req.params.id));
  });

  router.post('/', (req, res) => {
    const flag = storage.createFlag(req.body);
    res.status(201);
    res.set('Location', `/api/v1/flags/${flag.id}`);
    res.json(flag);
  });

  return router;
};
