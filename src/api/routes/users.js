var express = require('express');
var router = express.Router();

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": ""
 *       "error": "UserNotFound"
 *     }
 */
const userNotFound = (res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'Id not found'
  })
};


module.exports = (storage) => {

  /**
  * @api {get} /v1/users List
  * @apiName List
  * @apiGroup User
  *
  * @apiSuccess {Object[]} List of users.
  *
  * @apiSuccessExample Success-Response
  *     HTTP/1.1 200 OK
  *     [
  *       {
  *         "id": "advanced-search",
  *         "description": "Advanced search functionality"
  *       }
  *     ]
  */
  router.get('/', (req, res) => {
    storage.getUsers()
      .then((data) => {
        res.json(data);
      }).catch((e) => {
        console.log(e);
        res.status(500);
      });
  });

  /**
  * @api {get} /v1/user/:id Get
  * @apiName Get
  * @apiGroup User
  *
  * @apiParam {Number} id User unique ID.
  *
  * @apiSuccess {Object} User resource.
  *
  * @apiSuccessExample Success-Response
  *     HTTP/1.1 200 OK
  *     {
  *       "id": "advanced-search",
  *       "description": "Advanced search functionality"
  *     }
  *
  * @apiUse UserNotFoundError
  */
  router.get('/:id', (req, res) => {
    storage.getUser(req.params.id)
      .then((data) => {
        if (data === undefined) {
          res.status(404);
        }
        res.json(data);
      });
  });

  /**
  * @api {post} /v1/user/:id? Create
  * @apiName Create
  * @apiGroup User
  *
  * @apiParam {Number} [id] User unique ID.
  * @apiParam {Json} Updated User resource
  *
  * @apiParamExample {json} Request-Example
  *              { "id": "advanced-search", "description": "New description" }
  *
  * @apiSuccess {Object} User resource.
  *
  * @apiSuccessExample Success-Response
  *     HTTP/1.1 200 OK
  *     {
  *       "id": "advanced-search",
  *       "description": "New description"
  *     }
  *
  * @apiUse UserNotFoundError
  */
  router.post('/:id?', (req, res) => {
    const user = req.body;
    if (req.params.id !== undefined) {
      user.id = req.params.id;
    }
    storage.getUser(user.id)
      .then((data) => {
        if (data === undefined) {
          storage.createUser(user)
            .then((data) => {
              res.status(201);
              res.set('Location', `/api/v1/users/${data.id}`);
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

  /**
  * @api {put} /v1/user/:id Update
  * @apiName Update
  * @apiGroup User
  *
  * @apiParam {Number} id User unique ID.
  *
  * @apiSuccess {Object} User resource.
  *
  * @apiSuccessExample Success-Response
  *     HTTP/1.1 200 OK
  *     {
  *       "id": "advanced-search",
  *       "description": "Advanced search functionality"
  *     }
  *
  * @apiUse UserNotFoundError
  */
  router.put('/:id', (req, res) => {
    const user = req.body;
    storage.getUser(req.params.id)
      .then((data) => {
        if (data === undefined) {
          userNotFound(res);
        } else {
          storage.updateUser(req.params.id, user)
            .then((data) => {
              res.json(data);
            });
        }
      });
  });

  /**
  * @api {delete} /v1/user/:id Delete
  * @apiName Delete
  * @apiGroup User
  *
  * @apiParam {Number} id User unique ID.
  *
  * @apiSuccessExample Success-Response
  *     HTTP/1.1 204 OK
  *
  * @apiUse UserNotFoundError
  */
  router.delete('/:id', (req, res) => {
    storage.getUser(req.params.id)
      .then((data) => {
        if (data === undefined) {
          userNotFound(res);
        } else {
          storage.deleteUser(req.params.id)
            .then((data) => {
              res.status(204);
              res.json();
            });
        }
      });
  });

  return router;
};
