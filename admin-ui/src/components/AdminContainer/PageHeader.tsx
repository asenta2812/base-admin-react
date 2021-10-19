import { Card, Col, Row } from 'antd';
import React, { useContext } from 'react';
import SearchBar from '../SearchBar';
import styles from './index.less';
import { PageContext } from './PageContext';

type HeaderProps = {
  headerFilter?: React.ReactNode;
  customHeader?: React.ReactNode;
};
const PageHeader = ({ headerFilter, customHeader }: HeaderProps) => {
  const { search, data } = useContext(PageContext);
  return (
    <Card bodyStyle={{ padding: '10px' }} className={styles.header}>
      {customHeader || (
        <Row>
          <Col span={18}>{headerFilter}</Col>
          <Col span={6} offset={18}>
            <SearchBar loading={data.loading} onSearch={(value) => search(value)} />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default PageHeader;
