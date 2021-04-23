import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { AnimationContainer, Background, Container, Content } from './styles';
import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Type a valid email.')
            .required('Email is required.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);
        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Recover password email sent.',
          description:
            'An email has been sent to you, please follow the instructions in the email to recover your password.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Forgot Password',
          description:
            'An error has occurred when trying to recover the password.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, setLoading],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt={'logo'} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>

            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder={'email'}
            />
            <Button loading={loading} type={'submit'}>
              Recover Password
            </Button>
          </Form>
          <Link to={'/'}>
            <FiLogIn />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
