const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  res.code = httpStatus.CREATED;
  res.result = { user, ...tokens };
  next();
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.result = { user, ...tokens };
  next();
});

const logout = catchAsync(async (req, res, next) => {
  await authService.logout(req.body.refreshToken);
  res.code = httpStatus.NO_CONTENT;
  next();
});

const refreshTokens = catchAsync(async (req, res, next) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.result = { ...tokens };
  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.code = httpStatus.NO_CONTENT;
  next();
});

const resetPassword = catchAsync(async (req, res, next) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.code = httpStatus.NO_CONTENT;
  next();
});

const sendVerificationEmail = catchAsync(async (req, res, next) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.code = httpStatus.NO_CONTENT;
  next();
});

const verifyEmail = catchAsync(async (req, res, next) => {
  await authService.verifyEmail(req.query.token);
  res.code = httpStatus.NO_CONTENT;
  next();
});

const getMe = catchAsync(async (req, res, next) => {
  res.result = { ...req.user, password: undefined, id: req.user._id, _id: undefined, __v: undefined };
  next();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getMe,
};
