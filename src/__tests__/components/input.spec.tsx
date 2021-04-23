import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from '../../components/Input';
import { FiAlertCircle } from 'react-icons/fi';

jest.mock('react-icons/all', () => {
  return {
    FiAlertCircle: jest.fn(),
  };
});

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input Component', () => {
  it('shoud be able to render an input', async () => {
    const { getByPlaceholderText } = render(
      <Input name={'email'} placeholder={'email'} icon={FiAlertCircle} />,
    );
    await waitFor(() => {
      expect(getByPlaceholderText('email')).toBeTruthy();
    });
  });

  it('shoud render highlight when focused', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name={'email'} placeholder={'email'} icon={FiAlertCircle} />,
    );

    const inputElement = getByPlaceholderText('email');
    const inputContainer = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainer).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainer).not.toHaveStyle('color: #ff9000');
    });
  });

  it('shoud keep highlight when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name={'email'} placeholder={'email'} icon={FiAlertCircle} />,
    );

    const inputElement = getByPlaceholderText('email');
    const inputContainer = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: {
        value: 'johndue@example.com',
      },
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });
  });
});
