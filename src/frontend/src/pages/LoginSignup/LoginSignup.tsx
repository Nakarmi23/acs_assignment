import { Link, useParams } from 'react-router-dom';
import tw from 'twin.macro';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { SignupForm } from '../../components/SignUpForm/SignUpForm';
import { TextField } from '../../components/TextField/TextField';
import { buttonStyles, outlineButtonStyles } from '../../styles/buttonStyles';
import { textFieldStyles } from '../../styles/textFieldStyles';

export const LoginSignup = () => {
  const { type = 'login' } = useParams();

  return (
    <div tw='flex '>
      {type === 'login' && (
        <section tw='h-screen flex-wrap overflow-auto w-5/12 flex justify-center items-center  p-16'>
          <div tw=' flex flex-col space-y-4'>
            <h1 tw='text-2xl font-medium text-center'>
              Log in to Your Account
            </h1>
            <span tw='text-neutral-500 text-center block mt-4'>
              Log in to your account so you can continue building and edting
              your onboarding flows.
            </span>
            <LoginForm />
          </div>
        </section>
      )}
      <section tw='w-7/12 bg-blue-700 flex flex-col items-center justify-center h-screen flex-wrap overflow-auto'>
        <div tw='w-[500px] flex flex-col items-center justify-center space-y-5'>
          <h2 tw='text-white text-2xl font-medium text-center'>
            {type === 'signup'
              ? `Already Signed Up?`
              : `Don't have an Account Yet?`}
          </h2>
          <span tw='text-neutral-50 text-center block'>
            {type === 'signup'
              ? `All users on MySpace will know that there are millions of people out there. Every day besides so many people joining this community`
              : `
            Let's get you all set up so you can start createing your first
            onboarding experience.`}
          </span>
          <Link
            to={type === 'signup' ? '/account/login' : '/account/signup'}
            css={outlineButtonStyles}>
            {type === 'signup' ? `LOG IN` : `SIGN UP`}
          </Link>
        </div>
      </section>
      {type === 'signup' && (
        <section tw='w-5/12 flex justify-center items-center h-screen flex-wrap overflow-auto p-16'>
          <div tw='flex flex-col space-y-4'>
            <h1 tw='text-2xl font-medium text-center'>
              Sign Up for an Account
            </h1>
            <span tw='text-neutral-500 text-center block mt-4'>
              Let's get you all set up so you can start creating your first
              onboarding experience.
            </span>
            <SignupForm />
          </div>
        </section>
      )}
    </div>
  );
};
