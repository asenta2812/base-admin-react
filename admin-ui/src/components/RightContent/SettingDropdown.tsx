import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';
import { history, useIntl, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const SettingDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();
  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;

    history.push(`/system/${key}`);
  };
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="user">
          <UserOutlined />
          {intl.formatMessage({
            id: 'menu.settings.user',
          })}
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="role">
          <SettingOutlined />
          {intl.formatMessage({
            id: 'menu.settings.role',
          })}
        </Menu.Item>
      )}
    </Menu>
  );
  if (!menu) {
    return <></>;
  }
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <div className={`${styles.action} ${styles.account}`}>
        <span className={`${styles.icon} anticon`}>
          <SettingOutlined style={{ fontSize: '16px' }} />
        </span>
        <span className={`${styles.name} anticon`}>
          {intl.formatMessage({
            id: 'menu.settings',
          })}
        </span>
      </div>
    </HeaderDropdown>
  );
};

export default SettingDropdown;
