const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');

const createRole = catchAsync(async (req, res, next) => {
  const role = await roleService.createRole(req.body);
  res.code = httpStatus.CREATED;
  res.result = role;
  next();
});

const getRoles = catchAsync(async (req, res, next) => {
  const result = await roleService.queryRoles(req.query);
  res.result = result;
  next();
});

const getRole = catchAsync(async (req, res, next) => {
  const role = await roleService.getRoleById(req.params.roleId);
  res.result = role;
  next();
});

const updateRole = catchAsync(async (req, res, next) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.result = role;
  next();
});

const deleteRole = catchAsync(async (req, res, next) => {
  await roleService.deleteRoleById(req.params.roleId);
  res.code = httpStatus.NO_CONTENT;
  next();
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
