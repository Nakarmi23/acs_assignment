import { memo } from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '../../components/SignUpForm/SignUpForm';
import { outlineButtonStyles } from '../../styles/buttonStyles';

export const Signup = memo(() => {
  return (
    <div tw='flex '>
      <section tw='w-7/12 bg-blue-700 flex flex-col items-center justify-center h-screen flex-wrap overflow-auto'>
        <div tw='w-[500px] flex flex-col items-center justify-center space-y-5'>
          <h2 tw='text-white text-2xl font-medium text-center'>
            Already Signed Up?
          </h2>
          <span tw='text-neutral-50 text-center block'>
            Log in to your account so you can continue your work.
          </span>
          <Link to='/account/login' css={outlineButtonStyles}>
            LOG IN
          </Link>
        </div>
      </section>
      <section tw='w-5/12 flex justify-center items-center h-screen flex-wrap overflow-auto p-16'>
        <div tw='w-full flex flex-col space-y-4'>
          <h1 tw='text-2xl font-medium text-center'>Sign Up for an Account</h1>
          <span tw='text-neutral-500 text-center block mt-4'>
            Let's get you all set up so you can start your work.
          </span>
          <SignupForm />
        </div>
      </section>
    </div>
  );
});
