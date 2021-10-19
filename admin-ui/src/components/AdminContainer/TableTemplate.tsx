/* eslint-disable react-hooks/exhaustive-deps */
import { FIRST_PAGE, LIMIT_DATA } from '@/core/constant-value';
import { deleteRecord, getData } from '@/services/core/api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import { isEmpty } from 'lodash';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { generate } from 'shortid';
import { useAccess, useHistory, useIntl } from 'umi';
import { PageContext } from './PageContext';

export type TableTemplateProps<Record> = {
  selectFields?: string;
  isUseDefaultActionColumn?: boolean;
  searchFields?: string;
  isUseRedirectShareForm?: boolean;
} & TableProps<Record>;
export interface IRecordTable {
  id: string | number;
}
type StateTableType<Record> = {
  dataSource: Record[];
  total: number;
  columns?: any[];
};
const initStateTable = {
  dataSource: [],
  total: 0,
  columns: [],
};

export default function TableTemplate<Record extends IRecordTable = any>({
  columns,
  selectFields,
  isUseDefaultActionColumn = true,
  searchFields,
  isUseRedirectShareForm,
  ...props
}: TableTemplateProps<Record>): JSX.Element {
  const [stateTable, setStateTable] = useState<StateTableType<Record>>({
    ...initStateTable,
    columns,
  });
  const [query, setQuery] = useState<API.RequestDataGrid>({
    limit: LIMIT_DATA,
    page: FIRST_PAGE,
    select: selectFields,
  });
  const { canDelete } = useAccess();
  const { data, showLoading, hideLoading, setReloadTable, documentType, showModal, baseUrl } =
    useContext(PageContext);
  const intl = useIntl();
  const history = useHistory();

  const handleRemove = async (id: string | number): Promise<void> => {
    if (!id) return;
    showLoading();

    try {
      const resultRemove = await deleteRecord(baseUrl, { id });
      if (resultRemove.success) {
        setStateTable((old) => ({ ...old, dataSource: old.dataSource.filter((f) => f.id !== id) }));
        message.success(intl.formatMessage({ id: 'table.remove.success' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'table.remove.fail' }));
    } finally {
      hideLoading();
    }
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // filter
    const filtersQuery = {};
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtersQuery[key] = { $in: value };
        }
      });
    }
    // sort
    const sortQuery = !isEmpty(sorter)
      ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`
      : undefined;
    setQuery({
      limit: pagination.pageSize,
      page: pagination.current,
      filter: { ...filtersQuery },
      sortBy: sortQuery,
    });
  };

  const handleEdit = useCallback(
    (id: string) => {
      if (isUseRedirectShareForm) {
        const currentLocation = history.location.pathname;
        history.push(`${currentLocation}/update/${id}`);
      } else {
        showModal('update', id);
      }
    },
    [isUseRedirectShareForm, history],
  );

  // get data follow query
  useEffect(() => {
    if (!data.isReload) {
      return;
    }
    const getDataSource = async () => {
      showLoading();

      try {
        let searchQuery = {};
        const fields = searchFields ?? selectFields;
        if (data.searchTerm && fields) {
          const regex = `.*${data.searchTerm}.*`;
          const searchTerm: any[] = [];
          const fieldsArray = fields.split(' ');
          fieldsArray.forEach((field) => {
            searchTerm.push({ [field]: { $regex: regex } });
          });

          if (fieldsArray.length > 1) {
            searchQuery = { $or: searchTerm };
          } else {
            [searchQuery] = searchTerm;
          }
        }
        const response = await getData(baseUrl, {
          ...query,
          filter: { ...query.filter, ...searchQuery },
        });
        if (!response.success) {
          message.error(response.message);
        } else {
          setStateTable((old) => ({
            ...old,
            dataSource: response.data.results,
            total: response.data.total,
          }));
          setReloadTable(false);
        }
      } catch (error) {
        message.error(intl.formatMessage({ id: 'table.getdata.fail' }));
      } finally {
        hideLoading();
      }
    };
    getDataSource();
  }, [baseUrl, query, data.searchTerm, searchFields, data.isReload]);

  // add columns
  useEffect(() => {
    if (isUseDefaultActionColumn) {
      columns?.unshift({
        title: '',
        dataIndex: 'option',
        width: 150,
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id.toString())}
            />
            {canDelete(documentType) ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleRemove(record.id)}>
                <Button type="primary" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ) : null}
          </Space>
        ),
      });
      setStateTable((old) => ({ ...old, columns }));
    }
  }, [canDelete, documentType, isUseDefaultActionColumn]);

  return (
    <Table<Record>
      onChange={handleTableChange}
      {...props}
      bordered
      /**
       * expandable, nested list https://ant.design/components/table/#expandable
       */
      // expandable={}
      /**
       * footer, render footer `function(currentPageData)`
       */
      // footer={}

      pagination={{
        size: 'small',
        defaultPageSize: LIMIT_DATA,
        position: ['bottomRight'],
        showSizeChanger: true,
        total: stateTable.total,
        showTotal: (t) => `${t} items`,
      }}
      /**
       * row className
       */
      // rowClassName

      /**
       * row key
       */
      rowKey={(record) => record.id ?? generate()}
      /**
       * scroll: https://ant.design/components/table/#scroll
       */
      scroll={{
        scrollToFirstRowOnChange: true,
        y: 'calc(100vh - 23em)',
      }}
      sticky
      loading={data.loading}
      {...stateTable}
    />
  );
}
