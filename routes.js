const express = require('express');
const passport = require('passport');
const logger = require('winston');
const ServerError = require('./lib/server_error');
const controllers = require('./controllers');

const router = express.Router();
const { auth, products } = controllers;

/**
 * Handles controller execution and responds to user (API version).
 * This way controllers are not attached to the API.
 * @param promise Controller Promise.
 * @param params (req) => [params, ...].
 */
const controllerHandler = (promise, params, noEnd) => async (
  req,
  res,
  next
) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);

    if (!noEnd) {
      return res.json({
        status: 200,
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Auth.
 */
router.post(
  '/signin',
  controllerHandler(auth.signin, (req, res, next) => [req.body])
);
router.post(
  '/signup',
  controllerHandler(auth.signup, (req, res, next) => [req.body])
);

/**
 * Products.
 */
router.get(
  '/products',
  passport.authenticate('jwt', { session: false }),
  controllerHandler(products.getAll, (req, res, next) => [req.query, req.user])
);

/**
 * 404
 */
router.use((req, res, next) => {
  next(new ServerError('Not Found', 404));
});

/**
 * Error-handler.
 */
router.use((err, req, res, _next) => {
  // Expected errors always throw ServerError.
  // Unexpected errors will either throw unexpected stuff or crash the application.
  if (Object.prototype.isPrototypeOf.call(ServerError.prototype, err)) {
    return res
      .status(err.status || 500)
      .json({ status: err.status || 500, message: err.message });
  }

  logger.error('~~~ Unexpected error exception start ~~~');
  console.error(req);
  logger.error(err);
  logger.error('~~~ Unexpected error exception end ~~~');

  return res.status(500).json({ status: 500, message: err.message });
});

module.exports = router;
