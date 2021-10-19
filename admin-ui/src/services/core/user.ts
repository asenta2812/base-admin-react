import { sendRequest } from "@/utils";


/* DELETE USER */
export async function deleteUser(id?: number): Promise<API.ResponseBase> {
    return request<API.ResponseBase>((getFullUrl(`users/${id}`)), {
        method: 'DELETE',
    });
}

// Get User by id?: string
export async function getUserById(id?: string): Promise<API.ResponseBase> {
    return request<API.ResponseBase>((getFullUrl(`users/${id}`)), {
        method: 'GET'
    });
}

export async function getUsers(
    params: API.RequestDataGrid
): Promise<Auth.LoginResponse> {
    return sendRequest<Auth.LoginResponse>({ url: 'users', method: 'GET', params });
}