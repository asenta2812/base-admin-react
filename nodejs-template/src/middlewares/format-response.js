const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

function formatResponse(req, res, next) {
  const code = res.code || httpStatus.OK;
  const data = res.result;
  // send back a 404 error for any unknown api request
  if (!res.code && !data) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  }
  res.status(code).send({
    code,
    success: true,
    data,
  });
}
module.exports = {
  formatResponse,
};
