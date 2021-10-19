import type { ACTIONS_TYPES, DOCUMENT_TYPES } from "./core/constant-value";

export default function access(initialState: { currentUser?: Auth.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const canAccess = (document: DOCUMENT_TYPES, action: ACTIONS_TYPES) => {
    const dps = currentUser?.permissions.find(f => f.document === document);
    return dps && dps.actions.includes(action);
  }
  return {
    canAdmin: currentUser && currentUser.role === 'admin',
    canAccess,
    canAdd: (document: DOCUMENT_TYPES) => {
      return canAccess(document, 'add')
    },
    canUpdate: (document: DOCUMENT_TYPES) => {
      return canAccess(document, 'update')
    },
    canDelete: (document: DOCUMENT_TYPES) => {
      return canAccess(document, 'delete')
    },
    canView: (document: DOCUMENT_TYPES) => {
      return canAccess(document, 'view')
    },
    canShowMenu: (document: DOCUMENT_TYPES) => {
      return canAccess(document, 'showMenu')
    },
  };
}