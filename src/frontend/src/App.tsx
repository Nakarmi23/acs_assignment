import { Navigate, Route, Routes } from 'react-router-dom';
import { PasswordReset } from './pages/ForgotPassword/ForgetPassword';
import { Home } from './pages/Home/Home';
import { Login } from './pages/LoginSignup/Login';
import { Signup } from './pages/LoginSignup/Signup';

function App() {
  return (
    <Routes>
      <Route path='account'>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        <Route index element={<Navigate to='login' />} />
        <Route path='*' element={<Navigate to='login' />} />
      </Route>
      <Route path='password-reset' element={<PasswordReset />} />
      <Route path='home' element={<Home />} />
      <Route index element={<Navigate to='account' />} />
      <Route path='*' element={<Navigate to='account' />} />
    </Routes>
  );
}

export default App;
