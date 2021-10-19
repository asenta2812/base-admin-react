/* eslint-disable react-hooks/exhaustive-deps */
import { createRecord, getRecord, updateRecord } from '@/services/core/api';
import type { FormInstance, ModalProps } from 'antd';
import { Modal, Skeleton, Form } from 'antd';
import { upperFirst } from 'lodash';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShowMessage } from '../Notification';
import { PageContext } from './PageContext';

type PageShareModalProps<Record> = {
  renderChildren: (form: FormInstance<Record>, initValueForm?: Record) => JSX.Element;
} & ModalProps;

export type ModalState = 'create' | 'update' | 'detail';

export default function PageShareModal<Record>({
  renderChildren,
  ...props
}: PageShareModalProps<Record>): JSX.Element {
  const { data, hideModal, setReloadTable, showLoading, hideLoading, baseUrl, documentType } =
    useContext(PageContext);
  const [record, setRecord] = useState<Record>();
  const [loadingDataForm, setLoadingDataForm] = useState<boolean>(false);
  const [form] = Form.useForm<Record>();

  const handleOk = useCallback(() => {
    if (form) {
      const submit = async () => {
        await form.validateFields();
        const formValues = form.getFieldsValue();
        showLoading();
        const response =
          data.modalState === 'create'
            ? await createRecord(baseUrl, formValues)
            : await updateRecord(baseUrl, { id: data.recordId }, formValues);
        if (response.success) {
          ShowMessage({
            type: 'success',
            title: `${upperFirst(data.modalState)} ${documentType} successfully!`,
          });
          setReloadTable(true);
          hideModal();
        }
        hideLoading();
      };
      submit();
    }
  }, [form, data.modalState, data.recordId]);

  const handleCancel = useCallback(() => {
    hideModal();
    if (form) {
      form.resetFields();
    }
  }, [form]);
  useEffect(() => {
    if (data.modalState === 'update' && data.recordId) {
      setLoadingDataForm(true);
      const get = async () => {
        const recordDb = await getRecord(baseUrl, { id: data.recordId });
        setLoadingDataForm(false);
        setRecord(recordDb.data);
      };
      get();
    } else {
      setRecord(undefined);
    }
  }, [data.recordId, data.modalState]);

  return (
    <Modal
      {...props}
      visible={data.visibleModal}
      title={upperFirst(data.modalState)}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {loadingDataForm ? <Skeleton /> : renderChildren(form, record)}
    </Modal>
  );
}
