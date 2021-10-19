const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { DocumentType, SecurityOperations } = require('../config/constants');

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      immutable: true,
    },
    description: {
      type: String,
    },
    permissions: [
      {
        _id: false,
        document: { _id: false, type: String, required: true, enums: Object.keys(DocumentType) },
        actions: [{ id: false, type: String, required: true, enums: Object.keys(SecurityOperations) }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

/**
 * Check permission by role, action, document
 * @param {string} name - name of role
 * @param {string} document - one of DocumentType
 * @param {string} action - one of SecurityOperations
 * @returns {Promise<boolean>}
 */
roleSchema.statics.isHavePermission = async function (name, document, action) {
  const role = await this.findOne({ name });
  if (!role) {
    return false;
  }
  const permission = role.permissions.find((f) => f.document === document);
  if (!permission) {
    return false;
  }
  return permission.actions.length > 0 && permission.actions.findIndex((item) => item === action) !== -1;
};

/**
 * @typedef Role
 */
const Role = mongoose.model('Role', roleSchema);

Role.find({ name: 'admin' }).then((res) => {
  if (res.length === 0) {
    Role.create({
      name: 'admin',
      description: 'Role Admin',
      permissions: [
        { document: DocumentType.users, actions: Object.keys(SecurityOperations) },
        { document: DocumentType.roles, actions: Object.keys(SecurityOperations) },
      ],
    });
  }
});
module.exports = Role;
