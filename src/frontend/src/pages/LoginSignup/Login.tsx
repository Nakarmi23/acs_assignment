import { memo } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { outlineButtonStyles } from '../../styles/buttonStyles';

export const Login = memo(() => {
  return (
    <div tw='flex '>
      <section tw='h-screen flex-wrap overflow-auto w-5/12 flex justify-center items-center  p-16'>
        <div tw=' flex flex-col space-y-4'>
          <h1 tw='text-2xl font-medium text-center'>Log in to Your Account</h1>
          <span tw='text-neutral-500 text-center block mt-4'>
            Log in to your account so you can continue building and edting your
            onboarding flows.
          </span>
          <LoginForm />
        </div>
      </section>
      <section tw='w-7/12 bg-blue-700 flex flex-col items-center justify-center h-screen flex-wrap overflow-auto'>
        <div tw='w-[500px] flex flex-col items-center justify-center space-y-5'>
          <h2 tw='text-white text-2xl font-medium text-center'>
            Don't have an Account Yet?
          </h2>
          <span tw='text-neutral-50 text-center block'>
            Let's get you all set up so you can start createing your first
            onboarding experience.
          </span>
          <Link to='/account/signup' css={outlineButtonStyles}>
            SIGN UP
          </Link>
        </div>
      </section>
    </div>
  );
});
