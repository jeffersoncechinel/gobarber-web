import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import { Container, AnimationContainer, Content, Background } from './styles';
import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErrors';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/Toast';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignupFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          email: Yup.string()
            .email('Type a valid email address.')
            .required('Email is required.'),
          password: Yup.string().min(6, 'Password at least 6 characters.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Signup Success!',
          description: 'You may now log in.',
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
          title: 'Signup Failure',
          description: 'Signup error, please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logo} alt={'logo'} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create Your Account</h1>
            <Input name="name" icon={FaUser} placeholder={'name'} />
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
            <Button type={'submit'}>Create</Button>
          </Form>
          <Link to={'/'}>
            <FiArrowLeft />
            Back to SignIn
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
