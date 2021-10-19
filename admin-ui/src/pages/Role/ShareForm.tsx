import ShowNotification, { ShowMessage } from '@/components/Notification';
import type { PermissionType, ShareFormType } from '@/core/constant-value';
import { PermissionArray } from '@/core/constant-value';
import { getRoleById, updateOrCreateRole } from '@/services/core/api';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'umi';
import { isNil, upperFirst } from 'lodash';

type ItemTableType = {
  documentTypeId: number;
  documentTypeName: number;
  documentTypeDescription: number;
  Add: boolean;
  Delete: boolean;
  Update: boolean;
  View: boolean;
};
export type FormRoleValueType = {
  id?: number;
  name: string;
  description: string;
  items: ItemTableType[];
};

type ParamsShareForm = {
  id?: string;
};

const ShareForm: React.FC = () => {
  const params = useParams<ParamsShareForm>();
  const history = useHistory();
  const [form] = useForm<FormRoleValueType>();
  const tableRef = useRef<ActionType>();

  const [initialValues, setInitialValues] = useState<FormRoleValueType>();
  const [typeForm, setTypeForm] = useState<ShareFormType>('create');
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [valueInForm, setValueInForm] = useState<any>();
  const isDisabledCheckbox = typeForm === 'detail';

  useEffect(() => {
    if (params.id) {
      if (history.location.pathname.includes('detail')) {
        setTypeForm('detail');
      } else {
        setTypeForm('update');
      }
    } else {
      setTypeForm('create');
    }

    const getRole = async () => {
      const dataRole = await getRoleById(params.id || '');
      if (dataRole.message === 'success') {
        setInitialValues(dataRole.data as FormRoleValueType);
        form.setFieldsValue(dataRole.data);
      }
    };
    getRole();
  }, [history.location.pathname, form, params.id]);

  useEffect(() => {
    if (initialValues) {
      // set isCheckAll
      const booleanArray = initialValues.items.reduce(
        (prev: boolean[], crr: ItemTableType) =>
          prev.concat(PermissionArray.map((currentItem) => crr[currentItem])),
        [],
      );
      const isFalseInArray = booleanArray.every((f) => f);
      setIsCheckAll(isFalseInArray);
    }
  }, [initialValues]);

  // change In Form
  useEffect(() => {
    if (!valueInForm) return valueInForm;
    // setValue In form
    const timerSetValueInForm = setTimeout(
      () => setInitialValues({ ...initialValues, ...valueInForm }),
      1000,
    );
    return () => {
      clearTimeout(timerSetValueInForm);
    };
  }, [valueInForm]);

  // click check all
  const onChangeCheckAll = (event: CheckboxChangeEvent) => {
    setIsCheckAll(event.target.checked);
    if (!initialValues || !event.target.checked) return;
    initialValues.items.forEach((item) => {
      PermissionArray.forEach((itemInArray) => {
        item[itemInArray] = true;
      });
    });

    setInitialValues({ ...initialValues });
  };

  // click check in record
  const onCheckInRecord = (record: ItemTableType, type: PermissionType) => {
    if (!initialValues) return;
    const currentRecord = record;
    currentRecord[type] = !currentRecord[type];

    setInitialValues({ ...initialValues });
  };

  // colum table documentType
  const columns: ProColumns<ItemTableType>[] = [
    {
      title: 'Name',
      dataIndex: 'documentTypeName',
      valueType: 'text',
    },
    {
      title: 'Description',
      dataIndex: 'documentTypeDescription',
      valueType: 'text',
    },
    {
      title: 'View',
      dataIndex: 'View',
      valueType: 'checkbox',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.View}
          onChange={() => onCheckInRecord(record, 'View')}
          disabled={isDisabledCheckbox}
        />
      ),
    },
    {
      title: 'Add',
      dataIndex: 'Add',
      valueType: 'checkbox',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.Add}
          onChange={() => onCheckInRecord(record, 'Add')}
          disabled={isDisabledCheckbox}
        />
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'Delete',
      valueType: 'checkbox',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.Delete}
          onChange={() => onCheckInRecord(record, 'Delete')}
          disabled={isDisabledCheckbox}
        />
      ),
    },
    {
      title: 'Update',
      dataIndex: 'Update',
      valueType: 'checkbox',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.Update}
          onChange={() => onCheckInRecord(record, 'Update')}
          disabled={isDisabledCheckbox}
        />
      ),
    },
  ];

  // validation error
  const validation = (value: FormRoleValueType): boolean => {
    const error = [];
    if (isNil(value.name)) {
      error.push('Name is required!');
    }
    if (isNil(value.description)) {
      error.push('Description is required!');
    }
    if (error.length) {
      ShowNotification({ title: 'You need to complete the following information', message: error });
      return false;
    }
    return true;
  };

  const handleSubmit = async (value: FormRoleValueType) => {
    if (!validation(value) || !initialValues) {
      return;
    }

    const { message } = await updateOrCreateRole(initialValues);
    if (message === 'success') {
      ShowMessage({ title: `${upperFirst(typeForm)} successfully!`, type: 'success' });
      history.push('/system/role');
    }
  };

  const renderForm = () => (
    <ProForm<FormRoleValueType>
      form={form}
      submitter={{
        render: () => (
          <FooterToolbar>
            <Button key="cancel" size="large" shape="round" onClick={() => history.goBack()}>
              <CloseOutlined /> Cancel
            </Button>
            {typeForm !== 'detail' ? (
              <Button
                key="submit"
                type="primary"
                size="large"
                shape="round"
                onClick={() => form.submit()}
              >
                <CheckOutlined />
                {upperFirst(typeForm)}
              </Button>
            ) : (
              ''
            )}
          </FooterToolbar>
        ),
      }}
      onFinish={handleSubmit}
      onValuesChange={(valueChange) => setValueInForm(valueChange)}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width="md"
          placeholder="Input name..."
          label="Name"
          required
          disabled={typeForm === 'update'}
        />
        <ProFormText
          name="description"
          width="md"
          placeholder="Input description..."
          label="Description"
          required
        />
        <Checkbox
          name="checkAll"
          checked={isCheckAll}
          onChange={(e) => onChangeCheckAll(e)}
          disabled={isDisabledCheckbox}
        >
          Check All
        </Checkbox>
      </ProForm.Group>

      {/* table */}
      <ProTable<ItemTableType>
        bordered={true}
        // scroll={{ y: 'calc(100vh - 400px)' }}
        // action ref reload table
        actionRef={tableRef}
        // rowKey with key is id unique of record
        rowKey="documentTypeId"
        // search bar
        search={false}
        dataSource={initialValues?.items}
        columns={columns}
        pagination={false}
        toolBarRender={false}
      />
    </ProForm>
  );

  return (
    <PageContainer>
      <Card title="Role Info">{renderForm()}</Card>
    </PageContainer>
  );
};

export default ShareForm;
