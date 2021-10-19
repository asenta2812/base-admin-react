import { getLocalStorage, sendRequest } from "@/utils";

/**  POST login */
export async function login(
    body: Auth.LoginRequest
): Promise<Auth.LoginResponse> {
    return sendRequest<Auth.LoginResponse>({ url: 'auth/login', method: 'POST', body });
}

/** GET current user */
export async function currentUser(): Promise<Auth.CurrentUser> {
    const result = await sendRequest<API.ResponseBase>({ url: 'auth/me', method: 'GET' });

    return result.data as Auth.CurrentUser;
}


/** POST logout */
export async function logout(): Promise<API.ResponseBase> {
    const refreshToken = getLocalStorage<Auth.Token>('access-token')?.refresh.token;
    return sendRequest<Auth.LoginResponse>({ url: 'auth/logout', method: 'POST', body: { refreshToken } });
}