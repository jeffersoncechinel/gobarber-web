import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('react-icons/all', () => {
  return {
    FiAlertCircle: jest.fn(),
    FiCheckCircle: jest.fn(),
    FiInfo: jest.fn(),
  };
});

jest.mock('../../hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('shoud be able to sign in', async () => {
    const { getByPlaceholderText, getByRole } = render(<SignIn />);
    const emailField = getByPlaceholderText('email');
    const passwordField = getByPlaceholderText('password');
    const buttonElement = getByRole('button');

    fireEvent.change(emailField, {
      target: {
        value: 'johndue@example.com',
      },
    });

    fireEvent.change(passwordField, {
      target: {
        value: '123456',
      },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shoud not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByRole } = render(<SignIn />);
    const emailField = getByPlaceholderText('email');
    const passwordField = getByPlaceholderText('password');
    const buttonElement = getByRole('button');

    fireEvent.change(emailField, {
      target: {
        value: 'johndue@example.com',
      },
    });

    fireEvent.change(passwordField, {
      target: {
        value: '123456',
      },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('shoud display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByRole } = render(<SignIn />);
    const emailField = getByPlaceholderText('email');
    const passwordField = getByPlaceholderText('password');
    const buttonElement = getByRole('button');

    fireEvent.change(emailField, {
      target: {
        value: 'johndue@example.com',
      },
    });

    fireEvent.change(passwordField, {
      target: {
        value: '123456',
      },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
