import { PropsWithChildren } from 'react';
import React from 'react';
import { AuthState } from '../../feature/auth/auth-slice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }: PropsWithChildren<{}>) => {
  const authState = useSelector<RootState, AuthState['authState']>(
    (store) => store.auth.authState
  );

  if (authState === 'loggedIn') return <Navigate to='/' replace />;

  return <>{children}</>;
};
