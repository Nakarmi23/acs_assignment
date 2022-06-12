import { Navigate, Route, Routes } from 'react-router-dom';
import tw from 'twin.macro';
import { LoginSignup } from './pages/LoginSignup/LoginSignup';

function App() {
  return (
    <Routes>
      <Route path='account/:type' element={<LoginSignup />} />
      <Route index element={<Navigate to='account/login' />} />
    </Routes>
  );
}

export default App;
