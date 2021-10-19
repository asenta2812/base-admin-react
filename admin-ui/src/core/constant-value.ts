const ConstantValue = {
  KeyAccessToken: 'react-access-token',
};
export default ConstantValue;

export type ShareFormType = 'detail' | 'update' | 'create';

export const ACTIONS = {
  showMenu: 'showMenu',
  add: 'add',
  view: 'view',
  update: 'update',
  delete: 'delete'
}

export type ACTIONS_TYPES = keyof typeof ACTIONS;


export const DOCUMENTS = {
  users: 'users',
  roles: 'roles'
}

export type DOCUMENT_TYPES = keyof typeof DOCUMENTS;


export const LIMIT_DATA = 20;

export const FIRST_PAGE = 1;