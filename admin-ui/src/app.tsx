import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ShowNotification from './components/Notification';
import NoPermissionPage from './pages/403';
import { currentUser as queryCurrentUser } from './services/core/auth';
import { getLocalStorage, removeLocalStorage } from './utils';

export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: Auth.CurrentUser;
  fetchUserInfo?: () => Promise<Auth.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      removeLocalStorage('access-token');
      history.push('/user/login');
    }
    return undefined;
  };
  // if user not login access another route != login
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
}
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => null,
    onPageChange: async () => {
      const { location } = history;
      // if user not login access another route != login
      const accessToken = getLocalStorage<Auth.Token>('access-token');
      if (!accessToken && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
      // if user logged and path name == '/user/login'

      if (accessToken && location.pathname === '/user/login') {
        history.push('/');
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
          setInitialState({ ...initialState, currentUser: userInfo });
        }
      }
    },
    menuDataRender: (menuData) => {
      return menuData;
    },
    // config 403 page
    unAccessible: <NoPermissionPage />,
    ...initialState?.settings,
  };
};
const errorHandler = (error: ResponseError<API.ResponseBase>) => {
  const { data } = error;

  if (data && data.code >= 300) {
    ShowNotification({ message: data.message });
  }

  if (!error.response) {
    ShowNotification({ message: 'Access unstable' });
  }
  throw error;
};
const getAccessToken = (): string => {
  return getLocalStorage<Auth.Token>('access-token')?.access.token as string;
};

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  if (url.includes('auth/login')) {
    return { url, options };
  }
  const authHeader = { Authorization: `Bearer ${getAccessToken()}` };
  return {
    url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [authHeaderInterceptor],
};
