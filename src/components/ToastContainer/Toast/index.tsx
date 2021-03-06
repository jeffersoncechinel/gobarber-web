import React, { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/all';
import { Container } from './styles';
import { ToastMessage, useToast } from '../../../hooks/Toast';

interface ToastProps {
  key: string;
  message: ToastMessage;
  style: Object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

export const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      $hasDescription={Number(!!message.description)}
      type={message.type}
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button type={'button'} onClick={() => removeToast(message.id)}>
        <FiAlertCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
