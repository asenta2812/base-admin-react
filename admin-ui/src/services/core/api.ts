// @ts-ignore
/* eslint-disable */
import { FormRoleValueType } from '@/pages/Role/ShareForm';
import { sendRequest } from '@/utils';
import { request } from 'umi';

const getFullUrl = (url: string): string => {
  return `${API_URL}${url}`;
};

export async function getData(
  url: string,
  params: API.RequestDataGrid
): Promise<API.ResponseDataGrid> {
  return sendRequest<API.ResponseDataGrid>({ url, method: 'GET', params });
}

export async function deleteRecord(
  url: string,
  params: API.RequestIdRecord
): Promise<API.ResponseBase> {
  const urlReq = `${url}/${params.id}`;
  return sendRequest<API.ResponseBase>({ url: urlReq, method: 'DELETE' });
}

export async function getRecord(url: string, params: API.RequestIdRecord): Promise<API.ResponseBase> {
  const urlReq = `${url}/${params.id}`;
  return sendRequest<API.ResponseBase>({ url: urlReq, method: 'GET' });
}
export async function createRecord<Record>(url: string, body: Record): Promise<API.ResponseBase> {
  return sendRequest<API.ResponseBase>({ url, method: 'POST', body });
}
export async function updateRecord<Record>(url: string, params: API.RequestIdRecord, body: Record): Promise<API.ResponseBase> {
  const urlReq = `${url}/${params.id}`;
  return sendRequest<API.ResponseBase>({ url: urlReq, method: 'PATCH', body });
}


/**  GET all role*/
export async function getRoles(
  params: API.RequestDataGrid
): Promise<API.RuleList> {
  return request<API.RuleList>(getFullUrl('roles/data-grid'), {
    method: 'GET',
    params: {
      ...params
    },
    ...(params?.options || {}),
  });
}
export async function getLookupRoles(
  params: { keyWords?: string }
): Promise<API.ResponseBase> {
  return request<API.ResponseBase>(getFullUrl('roles/lookup'), {
    method: 'GET',
    params: {
      ...params
    }
  });
}

// get role by id 
export async function getRoleById(id?: string): Promise<API.ResponseBase> {
  return request<API.ResponseBase>((getFullUrl('roles/get-role/' + id)), {
    method: 'GET'
  });
}

// add or update Role
export async function updateOrCreateRole(roleDto: FormRoleValueType): Promise<API.ResponseBase> {
  const url = roleDto.id ? 'update-role' : 'create-role';
  return request<API.ResponseBase>((getFullUrl(`roles/${url}`)), {
    method: 'POST',
    data: roleDto
  });
}


// category

export async function getListCategory(
  params: API.RequestCategoryForDataGrid
): Promise<API.CategoryList> {
  return request<API.CategoryList>(getFullUrl('categories/data-grid'), {
    method: 'GET',
    params: {
      ...params
    },
    ...(params?.options || {}),
  });
}

/* DELETE USER*/
export async function deleteCategory(id?: number): Promise<API.ResponseBase> {
  return request<API.ResponseBase>((getFullUrl('categories/' + id)), {
    method: 'DELETE',
  });
}

// Get Category by id?: string
export async function getCategoryById(id?: string): Promise<API.ResponseBase> {
  return request<API.ResponseBase>((getFullUrl('categories/' + id)), {
    method: 'GET'
  });
}


/// project


export async function getListProject(
  params: API.RequestProjectForDataGrid
): Promise<API.ProjectList> {
  return request<API.ProjectList>(getFullUrl('projects/data-grid'), {
    method: 'GET',
    params: {
      ...params
    },
    ...(params?.options || {}),
  });
}

/* DELETE USER*/
export async function deleteProject(id?: number): Promise<API.ResponseBase> {
  return request<API.ResponseBase>((getFullUrl('projects/' + id)), {
    method: 'DELETE',
  });
}

// Get Project by id?: string
export async function getProjectById(id?: string): Promise<API.ResponseBase> {
  return request<API.ResponseBase>((getFullUrl('projects/' + id)), {
    method: 'GET'
  });
}