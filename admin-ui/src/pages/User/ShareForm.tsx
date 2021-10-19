/* eslint-disable no-template-curly-in-string */
import { PageContext } from '@/components/AdminContainer/PageContext';
import PageShareModal from '@/components/AdminContainer/PageShareModal';
import { getData } from '@/services/core/api';
import type { FormInstance } from 'antd';
import { Form, Input, Select } from 'antd';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useIntl } from 'umi';
import type { UserRecord } from '.';

export type FormUserValueType = {
  email?: string;
  fullName?: string;
  dateOfBirth?: Date;
  roleId?: number;
  gender?: number;
  isActive?: boolean;
};

export type ShareFormProps = {};

export default function UserForm() {
  const intl = useIntl();
  const { data } = useContext(PageContext);
  const [roleLookup, setRoleLookup] = useState<{ id: string; name: string; description: string }[]>(
    [],
  );

  const renderOptionRoles = useMemo(() => {
    if (roleLookup && roleLookup.length > 0) {
      return roleLookup.map(({ name, id, description }) => (
        <Select.Option key={id} value={name} children={`${name} | ${description}`} />
      ));
    }
    return <Select.Option value="" children={intl.formatMessage({ id: 'pages.users.noRole' })} />;
  }, [roleLookup]);

  useEffect(() => {
    const getRole = async () => {
      const roles = await getData('roles', {
        limit: -1,
        select: 'id name description',
        sortBy: 'name:asc',
      });
      setRoleLookup(roles.data?.results);
    };
    getRole();
  }, []);

  // useEffect(() => {}, []);
  const RenderForm = React.memo(
    (propForms: { initialValues?: UserRecord; form: FormInstance<UserRecord> }) => {
      const { initialValues, form } = propForms;

      useEffect(() => form.resetFields(), [form, initialValues]);
      const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
        pattern: {
          mismatch: 'Minimum eight characters, at least one letter and one number',
        },
      };
      return (
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ ...initialValues }}
          validateMessages={validateMessages}
          autoComplete="off"
        >
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Please select a role" allowClear>
              {renderOptionRoles}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Please input name" allowClear />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Please input email" allowClear />
          </Form.Item>
          {data.modalState === 'create' && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ }]}
            >
              <Input.Password placeholder="Please input password" allowClear />
            </Form.Item>
          )}
        </Form>
      );
    },
  );

  return (
    <PageShareModal<UserRecord>
      renderChildren={(form: FormInstance<UserRecord>, values?: UserRecord) => (
        <RenderForm initialValues={values} form={form} />
      )}
      width={700}
    />
  );
}
