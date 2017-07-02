var express = require('express');
var router = express.Router();
const ApiError = require('../lib/ApiError');

/**
 * @apiDefine FlagNotFoundError
 *
 * @apiError FlagNotFound The id of the Flag was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Resource not found",
 *       "error": {
 *         "name": "ApiError",
 *         "status": 404
 *       }
 *     }
 */
const flagNotFound = (message='Resource not found') => {
  throw new ApiError(404, message);
};


module.exports = (storage) => {

  /**
  * @api {get} /v1/flags List
  * @apiName List
  * @apiGroup Flag
  *
  * @apiSuccess {Object[]} List of flags.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     [
  *       {
  *         "id": "advanced-search",
  *         "description": "Advanced search functionality"
  *       }
  *     ]
  */
  router.get('/', (req, res, next) => {
    storage.getFlags()
      .then((data) => {
        res.json(data);
      }).catch((e) => {
        console.log(e);
        res.status(500);
      });
  });

  /**
  * @api {get} /v1/flag/:id Get
  * @apiName Get
  * @apiGroup Flag
  *
  * @apiParam {Number} id Flag unique ID.
  *
  * @apiSuccess {Object} Flag resource.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "id": "advanced-search",
  *       "description": "Advanced search functionality"
  *     }
  *
  * @apiUse FlagNotFoundError
  */
  router.get('/:id', (req, res, next) => {
    storage.getFlag(req.params.id)
      .then((data) => {
        if (data === undefined) {
          flagNotFound();
        }
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  });

  /**
  * @api {post} /v1/flag/:id? Create
  * @apiName Create
  * @apiGroup Flag
  *
  * @apiParam {Number} [id] Flag unique ID.
  * @apiParam {Json} Updated Flag resource
  *
  * @apiParamExample {json} Request-Example:
  *              { "id": "advanced-search", "description": "New description" }
  *
  * @apiSuccess {Object} Flag resource.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "id": "advanced-search",
  *       "description": "New description"
  *     }
  *
  * @apiUse FlagNotFoundError
  */
  router.post('/:id?', (req, res, next) => {
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
            })
            .catch((err) => {
              next(err);
            });
        } else {
          throw new ApiError(409, 'Id already in use.');
        }
      })
      .catch((err) => {
        next(err);
      });
  });

  /**
  * @api {put} /v1/flag/:id Update
  * @apiName Update
  * @apiGroup Flag
  *
  * @apiParam {Number} id Flag unique ID.
  *
  * @apiSuccess {Object} Flag resource.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "id": "advanced-search",
  *       "description": "Advanced search functionality"
  *     }
  *
  * @apiUse FlagNotFoundError
  */
  router.put('/:id', (req, res, next) => {
    const flag = req.body;
    storage.getFlag(req.params.id)
      .then((data) => {
        if (data === undefined) {
          flagNotFound(res);
        } else {
          storage.updateFlag(req.params.id, flag)
            .then((data) => {
              res.json(data);
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  });

  /**
  * @api {delete} /v1/flag/:id Delete
  * @apiName Delete
  * @apiGroup Flag
  *
  * @apiParam {Number} id Flag unique ID.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 204 OK
  *
  * @apiUse FlagNotFoundError
  */
  router.delete('/:id', (req, res, next) => {
    storage.getFlag(req.params.id)
      .then((data) => {
        if (data === undefined) {
          flagNotFound(res);
        } else {
          storage.deleteFlag(req.params.id)
            .then((data) => {
              res.status(204);
              res.json();
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  });

  return router;
};
