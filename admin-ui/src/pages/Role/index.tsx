import AdminContainer from '@/components/AdminContainer';
import type { IRecordTable } from '@/components/AdminContainer/TableTemplate';
import type { ColumnsType } from 'antd/lib/table';
import React from 'react';

interface RoleRecord extends IRecordTable {
  name: string;
  description: string;
}

const RoleList: React.FC = () => {
  const columns: ColumnsType<RoleRecord> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true,
    },
  ];
  return (
    <AdminContainer<RoleRecord>
      title="ROLE MANAGEMENT"
      documentType="roles"
      inTable={{ baseUrl: 'roles', columns }}
      titleButtonAdd="Add Roles"
    />
  );
};

export default RoleList;
