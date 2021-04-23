import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { AnimationContainer, Background, Container, Content } from './styles';
import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Type a valid email address.')
            .required('Email is required.'),
          password: Yup.string().required('Password is required.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Authentication Failure',
          description: 'Authentication error, verify your credentials.',
        });
      }
    },
    [signIn, addToast, history],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt={'logo'} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign In</h1>

            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder={'email'}
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder={'password'}
            />
            <Button type={'submit'}>Sign In</Button>
            <Link to={'/forgot-password'}>Forgot Password</Link>
          </Form>
          <Link to={'/signup'}>
            <FiLogIn />
            Create Account
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
