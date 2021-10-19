import type { ModalState } from "./PageShareModal";

export const TYPES_ACTION = {
    SEARCH: 'SEARCH',
    SHOW_LOADING: 'SHOW_LOADING',
    HIDE_LOADING: 'HIDE_LOADING',
    SHOW_MODAL: 'SHOW_MODAL',
    HIDE_MODAL: 'HIDE_MODAL',
    RELOAD_TABLE: 'RELOAD_TABLE',
};

export const search = (dispatch: any) => (searchTerm: string) => dispatch({ type: TYPES_ACTION.SEARCH, payload: searchTerm });
export const showLoading = (dispatch: any) => () => dispatch({ type: TYPES_ACTION.SHOW_LOADING });
export const hideLoading = (dispatch: any) => () => dispatch({ type: TYPES_ACTION.HIDE_LOADING });
export const showModal = (dispatch: any) => (modalState: ModalState = 'create', id: string = '') => dispatch({ type: TYPES_ACTION.SHOW_MODAL, payload: { id, modalState } });
export const hideModal = (dispatch: any) => () => dispatch({ type: TYPES_ACTION.HIDE_MODAL });
export const setReloadTable = (dispatch: any) => (type?: boolean) => dispatch({ type: TYPES_ACTION.RELOAD_TABLE, payload: type })