import { Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import NoticeIconView from '../NoticeIcon';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import SettingDropdown from './SettingDropdown';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      <NoticeIconView />
      <Avatar menu />
      {/* <SelectLang className={styles.action} /> */}
      <SettingDropdown menu />
    </Space>
  );
};
export default GlobalHeaderRight;
