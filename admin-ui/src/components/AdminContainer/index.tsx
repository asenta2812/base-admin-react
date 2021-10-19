import type { DOCUMENT_TYPES } from '@/core/constant-value';
import React from 'react';
import { useAccess } from 'umi';
import NoPermissionPage from '../../pages/403';
import { PageProvider } from './PageContext';
import type { PageLayoutProps } from './PageLayout';
import PageLayout from './PageLayout';
import type { IRecordTable } from './TableTemplate';

export type AdminContainerProps<T extends IRecordTable> = {
  documentType: DOCUMENT_TYPES;
  baseUrl: string;
} & PageLayoutProps<T>;
export default function AdminContainer<T extends IRecordTable>({
  documentType,
  baseUrl,
  ...props
}: AdminContainerProps<T>): JSX.Element {
  const { canView } = useAccess();

  // return 403 page when user dont have permission
  if (!canView(documentType)) {
    return <NoPermissionPage />;
  }

  return (
    <PageProvider documentType={documentType} baseUrl={baseUrl ?? documentType}>
      <PageLayout {...props} />
    </PageProvider>
  );
}
