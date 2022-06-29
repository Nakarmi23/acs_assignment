import axios from 'axios';
import { PropsWithChildren, useEffect } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AuthState } from '../../feature/auth/auth-slice';
import { Navigate } from 'react-router-dom';

export const RequireAuthentication = ({ children }: PropsWithChildren<{}>) => {
  const authState = useSelector<RootState, AuthState['authState']>(
    (store) => store.auth.authState
  );
  if (authState === 'loggedOut')
    return <Navigate to='/account/login' replace />;

  return <>{children}</>;
};
