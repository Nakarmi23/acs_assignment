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
import { ChangePassword } from './pages/Index/ChangePassword/ChangePassword';
import { PasswordReset } from './pages/Account/ForgotPassword/ForgetPassword';
import { Home } from './pages/Index/Home/Home';
import { Index } from './pages/Index/Index';
import { RootState, useAppDispatch } from './store';
import { Login } from './pages/Account/Login/Login';
import { Register } from './pages/Account/Register/Register';
import { Account } from './pages/Account/Account';

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
            <Index />
          </RequireAuthentication>
        }>
        <Route index element={<Home />} />
        <Route path='change-password' element={<ChangePassword />} />
      </Route>
      <Route
        path='account'
        element={
          <PublicRoute>
            <Account />
          </PublicRoute>
        }>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='forgot-password' element={<PasswordReset />} />
        <Route index element={<Navigate to='login' />} />
        <Route path='*' element={<Navigate to='login' />} />
      </Route>
    </Routes>
  );
}

export default App;
