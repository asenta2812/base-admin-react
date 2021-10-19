import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoPermissionPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you do not have permission to access this page."
    extra={
      <Button type="primary" onClick={() => history.replace('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoPermissionPage;
