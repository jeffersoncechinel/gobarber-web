import React, { useCallback, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { AnimationContainer, Background, Container, Content } from './styles';
import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);
  const location = useLocation();
  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Password is required.'),
          password_confirmation: Yup.string()
            .oneOf(
              [Yup.ref('password'), ''],
              'Password confirmation is incorrect.',
            )
            .required('Password is required.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error('Missing token');
        }

        await api.post('/password/reset', {
          token,
          password,
          password_confirmation,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Reset Password Failure',
          description: 'Reset password error, verify your data.',
        });
      }
    },
    [addToast, history, location.search],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt={'logo'} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset Password</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder={'New Password'}
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder={'Password confirmation'}
            />
            <Button type={'submit'}>Reset Password</Button>
            <Link to={'/forgot-password'}>Forgot Password</Link>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
