import React, { ChangeEvent, FormEvent, useCallback, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';

import { Container, Content, AvatarInput } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErrors';
import { FiArrowLeft, FiCamera, FiLock, FiMail } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          email: Yup.string()
            .email('Type a valid email.')
            .required('Email is required.'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val,
            then: Yup.string().required('Password is required.'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val,
              then: Yup.string().required('Password is required.'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), ''],
              'Incorrect password confirmation.',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);
        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Profile updated!',
          description: 'Your profile was successfully updated.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Profile error',
          description:
            'An error occurred when saving the profile, please try again.',
        });
      }
    },
    [addToast],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);
        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Picture updated!',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to={'/dashboard'}>
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <h1>My profile</h1>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor={'avatar'}>
              <FiCamera />
              <input
                type={'file'}
                id={'avatar'}
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>

          <Input name="name" icon={FaUser} placeholder={'nome'} />
          <Input
            name="email"
            icon={FiMail}
            type="email"
            placeholder={'email'}
          />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder={'current password'}
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder={'new password'}
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder={'password confirmation'}
          />
          <Button type={'submit'}>Confirm changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
