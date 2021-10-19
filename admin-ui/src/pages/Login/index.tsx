import Footer from '@/components/Footer';
import { login } from '@/services/core/auth';
import { setLocalStorage } from '@/utils';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import React, { useState } from 'react';
import { history, Link, useModel, useIntl } from 'umi';
import styles from './index.less';

type LoginRequest = {
  autoLogin: boolean;
} & Auth.LoginRequest;

const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as {
      redirect: string;
    };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      setInitialState({ ...initialState, currentUser: userInfo });
    }
  };

  const handleSubmit = async (values: LoginRequest) => {
    setSubmitting(true);

    try {
      // delete values.autoLogin;
      const { success, data } = await login({ email: values.email, password: values.password });

      if (success) {
        message.success(intl.formatMessage({ id: 'pages.login.loginSuccessful' }));
        setLocalStorage('access-token', { access: data.access, refresh: data.refresh });
        await fetchUserInfo();
        goto();
        return;
      }
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          className={styles.top}
          style={{
            marginTop: '50px',
          }}
        >
          <div className={styles.header}>
            <Link to="/">
              <img
                alt="logo"
                className={styles.logo}
                src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_logotype_emblem.png"
              />
            </Link>
          </div>
          <div className={styles.desc}></div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: 'Submit',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as LoginRequest);
            }}
          >
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Username'}
                rules={[
                  {
                    required: true,
                    message: 'Username is required',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Password'}
                rules={[
                  {
                    required: true,
                    message: 'Password is required',
                  },
                ]}
              />
            </>

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                {'Remember me?'}
              </ProFormCheckbox>
            </div>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
