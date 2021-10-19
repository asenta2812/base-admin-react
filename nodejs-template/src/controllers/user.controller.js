const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  res.code = httpStatus.CREATED;
  res.result = user;
  next();
});

const getUsers = catchAsync(async (req, res, next) => {
  const result = await userService.queryUsers(req.query);
  res.result = result;
  next();
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.result = user;
  next();
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserById(req.params.id, req.body);
  res.result = user;
  next();
});

const deleteUser = catchAsync(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Do not delete yourself!');
  }
  await userService.deleteUserById(req.params.id);
  res.code = httpStatus.OK;
  next();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
