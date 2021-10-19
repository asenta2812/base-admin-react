import { TYPES_ACTION } from './PageAction';
import type { ModalState } from './PageShareModal';

export type PageState = {
  searchTerm: string;
  loading: boolean;
  visibleModal: boolean;
  modalState: ModalState;
  recordId: string;
  isReload: boolean;
};
export const initialStatePage: PageState = {
  searchTerm: '',
  loading: false,
  visibleModal: false,
  modalState: 'create',
  recordId: '',
  isReload: true,
};

const PageReducer = (
  state = initialStatePage,
  options: { type: keyof typeof TYPES_ACTION; payload?: any },
) => {
  switch (options.type) {
    case TYPES_ACTION.SEARCH:
      return { ...state, searchTerm: options.payload };
    case TYPES_ACTION.SHOW_LOADING:
      return { ...state, loading: true };
    case TYPES_ACTION.HIDE_LOADING:
      return { ...state, loading: false };
    case TYPES_ACTION.SHOW_MODAL: {
      const { id, modalState } = options.payload;
      return {
        ...state,
        visibleModal: true,
        recordId: id,
        modalState,
      };
    }
    case TYPES_ACTION.RELOAD_TABLE:
      return { ...state, isReload: options.payload };
    case TYPES_ACTION.HIDE_MODAL:
      return { ...state, visibleModal: false };
    default:
      return state;
  }
};
export default PageReducer;
