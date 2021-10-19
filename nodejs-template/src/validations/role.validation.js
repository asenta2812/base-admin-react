const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { SecurityOperations, DocumentType } = require('../config/constants');

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    permission: Joi.array().items(
      Joi.object().keys({
        document: Joi.string().valid(...Object.keys(DocumentType)),
        actions: Joi.array().items(Joi.string().valid(...Object.keys(SecurityOperations))),
      })
    ),
  }),
};

const getRoles = {
  query: Joi.object().keys({
    filter: Joi.string(),
    select: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    roleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      description: Joi.string(),
      permission: Joi.array().items(
        Joi.object().keys({
          document: Joi.string().valid(...Object.keys(DocumentType)),
          actions: Joi.array().items(Joi.string().valid(...Object.keys(SecurityOperations))),
        })
      ),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
