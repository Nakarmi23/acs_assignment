import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { RequireAuthentication } from './components/RequireAuthentication/RequireAuthentication';
import {
  AuthState,
  removeSessionUser,
  saveSessionUser,
} from './feature/auth/auth-slice';
import { ChangePassword } from './pages/ChangePassword/ChangePassword';
import { PasswordReset } from './pages/ForgotPassword/ForgetPassword';
import { Home } from './pages/Home/Home';
import { Layout } from './pages/Layout/Layout';
import { Login } from './pages/LoginSignup/Login';
import { Signup } from './pages/LoginSignup/Signup';
import { RootState, useAppDispatch } from './store';

function App() {
  const authState = useSelector<RootState, AuthState['authState']>(
    (store) => store.auth.authState
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authState === 'uncertain')
      axios
        .get('/api/auth/profile')
        .then((res) => dispatch(saveSessionUser(res.data)))
        .catch(() => dispatch(removeSessionUser()));
  });

  if (authState === 'uncertain') return <>Loading...</>;

  return (
    <Routes>
      <Route
        path='/'
        element={
          <RequireAuthentication>
            <Layout />
          </RequireAuthentication>
        }>
        <Route index element={<Home />} />
        <Route path='change-password' element={<ChangePassword />} />
      </Route>
      <Route
        path='password-reset'
        element={
          <PublicRoute>
            <PasswordReset />
          </PublicRoute>
        }
      />
      <Route
        path='account'
        element={
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        }>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        <Route index element={<Navigate to='login' />} />
        <Route path='*' element={<Navigate to='login' />} />
      </Route>
    </Routes>
  );
}

export default App;
