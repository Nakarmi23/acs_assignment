import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/LoginSignup/Login';
import { Signup } from './pages/LoginSignup/Signup';

function App() {
  return (
    <Routes>
      <Route path='account/login' element={<Login />} />
      <Route path='account/signup' element={<Signup />} />
      <Route index element={<Navigate to='account/login' />} />
    </Routes>
  );
}

export default App;
