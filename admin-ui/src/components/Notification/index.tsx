import { List, message, notification } from 'antd';

type PropsNotification = {
  message?: string | string[];
  type?: 'error' | 'warning' | 'success' | 'info';
  title?: string;
};

const getMessages = (propMessage: string | string[] | undefined): React.ReactNode => {
  if (!propMessage) return '';
  if (Array.isArray(propMessage)) {
    return (
      <List
        size="small"
        dataSource={propMessage}
        renderItem={(item, index) => <List.Item>{`${index + 1}. ${item}`}</List.Item>}
      />
    );
  }
  return propMessage;
};
const ShowNotification = (props: PropsNotification) => {
  const type = props.type || 'error';
  notification[type]({
    message: props.title || type.charAt(0).toUpperCase() + type.substring(1),
    description: getMessages(props.message),
  });
};

export const ShowMessage = (props: PropsNotification) => {
  const type = props.type || 'error';
  message[type](props.title || type.charAt(0).toUpperCase() + type.substring(1));
}

export default ShowNotification;
