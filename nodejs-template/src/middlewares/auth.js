const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Role = require('../models/role.model');
const { SecurityOperations } = require('../config/constants');

/**
 *
 * @param {*} req
 * @param {*} resolve
 * @param {*} reject
 * @param {*} requiredRights [document: string, action: string]
 * @returns
 */
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    try {
      const [document, action = SecurityOperations.view, allowAccess = false] = requiredRights;
      if (!allowAccess) {
        const hasRequiredRights = await Role.isHavePermission(user.role, document, action);
        if (!hasRequiredRights) {
          return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
      }
    } catch (error) {
      return reject(error);
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
    async (req, res, next) => {
      return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
      })
        .then(() => next())
        .catch((err) => next(err));
    };

module.exports = auth;
