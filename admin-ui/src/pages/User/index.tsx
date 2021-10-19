import AdminContainer from '@/components/AdminContainer';
import type { IRecordTable } from '@/components/AdminContainer/TableTemplate';
import type { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import UserForm from './ShareForm';

export interface UserRecord extends IRecordTable {
  name: string;
  role: string;
}

const UserList: React.FC = () => {
  useEffect(() => {}, []);
  const columns: ColumnsType<UserRecord> = [
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      filters: [
        {
          text: 'nghia',
          value: 'nghia',
        },
        {
          text: 'hien',
          value: 'hien',
        },
      ],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
  ];
  return (
    <AdminContainer<UserRecord>
      title="USER MANAGEMENT"
      titleButtonAdd="Add Users"
      documentType="users"
      baseUrl="users"
      inTable={{
        columns,
        selectFields: 'id name email role',
        searchFields: 'name',
      }}
      shareFormPopup={<UserForm />}
    />
  );
};

export default UserList;
