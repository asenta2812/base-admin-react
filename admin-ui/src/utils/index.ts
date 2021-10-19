import { request } from 'umi';
import { isNil } from 'lodash';

type LocalStorageKey = 'access-token' | 'auth';


type Request = {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    url: string;
    body?: any;
    params?: any;
    options?: Record<string, any>,
}

export function getFullUrl(url: string): string {
    return `${API_URL}${url}`;
}
export function sendRequest<T extends API.ResponseBase>(req: Request): Promise<T> {
    return request<T>(getFullUrl(req.url), {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
        },
        data: req.body,
        params: {
            ...req.params
        },
        ...(req.options || {}),
    });
}

export function isEmail(email: string | undefined): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function removeLocalStorage(key: LocalStorageKey): void {
    window.localStorage.removeItem(key);
}
export function setLocalStorage(key: LocalStorageKey, value: any): void {
    if (isNil(value)) {
        window.localStorage.removeItem(key);
    } else {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}
export function getLocalStorage<T>(key: LocalStorageKey): T | null {
    const vl = window.localStorage.getItem(key);
    return vl ? JSON.parse(vl) as T : null;
}