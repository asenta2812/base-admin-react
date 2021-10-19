/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { TabPaneProps } from 'antd';
import { Button } from 'antd';
import React, { useCallback, useContext, useMemo } from 'react';
import { useAccess, useHistory } from 'umi';
import { PageContext } from './PageContext';
import PageHeader from './PageHeader';
import type { IRecordTable, TableTemplateProps } from './TableTemplate';
import TableTemplate from './TableTemplate';

export type PageLayoutProps<T extends IRecordTable> = {
  tabList?: (TabPaneProps & {
    key?: React.ReactText;
  })[];
  content?: string;
  footer?: React.ReactNode[];
  customExtra?: React.ReactNode[];
  title?: string;
  subTitle?: string;
  // table grid data
  isShowTable?: boolean;
  inTable?: TableTemplateProps<T>;
  headerFilter?: JSX.Element;
  customHeader?: JSX.Element;
  titleButtonAdd?: string;
  shareFormPopup?: JSX.Element;
  isUseRedirectShareForm?: boolean;
};
export default function PageLayout<T extends IRecordTable>({
  isShowTable = true,
  titleButtonAdd,
  customExtra,
  shareFormPopup,
  isUseRedirectShareForm = false,
  ...props
}: PageLayoutProps<T>): JSX.Element {
  const { canAdd } = useAccess();
  const { documentType, showModal } = useContext(PageContext);
  const history = useHistory();
  const handleClickAdd = useCallback(() => {
    if (isUseRedirectShareForm) {
      const currentPathName = history.location.pathname;
      history.push(`${currentPathName}/add`);
    } else {
      showModal('create');
    }
  }, [isUseRedirectShareForm]);
  const renderExtra = useMemo((): React.ReactNode[] => {
    if (customExtra) {
      return customExtra;
    }
    return [
      canAdd(documentType) && (
        <Button
          type="primary"
          size="middle"
          key="button-add"
          icon={<PlusOutlined />}
          onClick={handleClickAdd}
        >
          {titleButtonAdd ?? 'Add'}
        </Button>
      ),
    ];
  }, [canAdd, customExtra, documentType, titleButtonAdd]);
  return (
    <PageContainer ghost breadcrumb={{}} extra={renderExtra} {...props}>
      <PageHeader {...props} />
      {isShowTable && (
        <TableTemplate<T> {...props.inTable} isUseRedirectShareForm={isUseRedirectShareForm} />
      )}
      {!isUseRedirectShareForm && !!shareFormPopup && shareFormPopup}
    </PageContainer>
  );
}
