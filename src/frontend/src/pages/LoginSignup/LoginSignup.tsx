import { Link, useParams } from 'react-router-dom';
import tw from 'twin.macro';
import { TextField } from '../../components/TextField/TextField';
import { buttonStyles, outlineButtonStyles } from '../../styles/buttonStyles';
import { textFieldStyles } from '../../styles/textFieldStyles';

export const LoginSignup = () => {
  const { type = 'login' } = useParams();

  return (
    <div tw='flex h-screen'>
      {type === 'login' && (
        <section tw='w-5/12 flex justify-center items-center'>
          <div tw=' w-4/5 flex flex-col space-y-4'>
            <h1 tw='text-2xl font-medium text-center'>
              Log in to Your Account
            </h1>
            <span tw='text-neutral-500 text-center block mt-4'>
              Log in to your account so you can continue building and edting
              your onboarding flows.
            </span>
            <form tw='flex flex-col space-y-6'>
              <TextField
                label='Email'
                placeholder='Enter your email address'
                type='email'
              />
              <TextField
                label='Password'
                placeholder='Enter your password'
                type='password'
              />
              <div tw='flex justify-between'>
                <label tw='flex items-center select-none'>
                  <input
                    type='checkbox'
                    tw='border-neutral-300 rounded cursor-pointer'
                  />
                  <span tw='text-neutral-700 ml-2 '>Remember me</span>
                </label>
                <button tw='text-blue-700 hover:text-blue-800'>
                  Forgot password
                </button>
              </div>
              <button css={buttonStyles}>LOG IN</button>
            </form>
          </div>
        </section>
      )}
      <section tw='w-7/12 bg-blue-700 flex flex-col items-center justify-center'>
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
        <section tw='w-5/12 flex justify-center items-center'>
          <div tw=' w-4/5 flex flex-col space-y-4'>
            <h1 tw='text-2xl font-medium text-center'>
              Sign Up for an Account
            </h1>
            <span tw='text-neutral-500 text-center block mt-4'>
              Let's get you all set up so you can start creating your first
              onboarding experience.
            </span>
            <form tw='flex flex-col space-y-5'>
              <TextField
                label='Name'
                placeholder='Enter full name'
                type='text'
              />
              <TextField
                label='Email'
                placeholder='Enter your email address'
                type='email'
              />
              <TextField
                label='Password'
                placeholder='Enter a strong password'
                type='password'
              />
              <TextField
                label='Password'
                placeholder='Repeat your password'
                type='password'
              />
              <div tw='flex justify-between'>
                <label tw='flex items-center select-none'>
                  <input
                    type='checkbox'
                    tw='border-neutral-300 rounded cursor-pointer'
                  />
                  <span tw='text-neutral-700 ml-2 '>
                    I accept the{' '}
                    <a href='#' tw='text-blue-700'>
                      Terms & Conditions
                    </a>
                  </span>
                </label>
              </div>
              <button css={buttonStyles}>SIGN UP</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};
