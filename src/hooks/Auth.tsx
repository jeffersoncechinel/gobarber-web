import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  updateUser(user: User): void;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const Auth = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@gobarber:token');
    const user = localStorage.getItem('@gobarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@gobarber:token', token);
    localStorage.setItem('@gobarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);
  const signOut = useCallback(() => {
    localStorage.removeItem('@gobarber:token');
    localStorage.removeItem('@gobarber:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@gobarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <Auth.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
      {children}
    </Auth.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(Auth);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
