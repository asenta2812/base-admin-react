// @ts-ignore
/* eslint-disable */

declare namespace API {
  type BaseLookupResponse = {
    value: string | number;
    label: string;
  }

  type ResponseBase = {
    code: number;
    message?: string;
    success?: boolean;
    data?: any
  };
  type RequestDataGrid = {
    sortBy?: string,
    filter?: any,
    limit?: number,
    page?: number,
    select?: string,
    populate?: any
  }
  type ResponseDataGrid = {
    data: {
      results: any[],
      total: number,
    }
  } & ResponseBase;
  type PermissionItems = {
    documentTypeName: string;
    [key: string]: boolean;
  }

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type RequestIdRecord = {
    id: number | string
  }
}
