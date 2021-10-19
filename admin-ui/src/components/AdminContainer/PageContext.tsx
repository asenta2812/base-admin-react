import createDataContext from '@/context/createDataContext';
import type { PageState } from './PageReducer';
import PageReducer, { initialStatePage } from './PageReducer';
import {
  search,
  showLoading,
  hideLoading,
  hideModal,
  showModal,
  setReloadTable,
} from './PageAction';
import type { DOCUMENT_TYPES } from '@/core/constant-value';
import type { ModalState } from './PageShareModal';

export type PageContextType = {
  search: (key: string) => void;
  showLoading: () => void;
  hideLoading: () => void;
  showModal: (modalState: ModalState, id?: string) => void;
  hideModal: () => void;
  setReloadTable: (type?: boolean) => void;
  data: PageState;
  documentType: DOCUMENT_TYPES;
  baseUrl: string;
};
export type PageProviderType = { documentType: DOCUMENT_TYPES; baseUrl: string };
export const [PageContext, PageProvider] = createDataContext<PageContextType, PageProviderType>(
  PageReducer,
  { search, showLoading, hideLoading, showModal, hideModal, setReloadTable },
  initialStatePage,
);
