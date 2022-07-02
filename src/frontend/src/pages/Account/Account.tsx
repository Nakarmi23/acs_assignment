import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const titleAndSubs = {
  login: {
    title: 'Log in to Your Account',
    sub: 'Log in to your account so you can continue your work.',
  },
  register: {
    title: 'Register for an Account',
    sub: `Let's get you all set up so you can start your work.`,
  },
  'forgot-password': {
    title: 'Forgot Password',
    sub: 'Please provider your email address and new password.',
  },
};

export const Account = () => {
  const location = useLocation();
  const titleAndSub: Record<'title' | 'sub', string> = useMemo(() => {
    console.log(location.pathname);
    switch (location.pathname) {
      case '/account/login':
        return titleAndSubs['login'];
      case '/account/register':
        return titleAndSubs.register;
      case '/account/forgot-password':
        return titleAndSubs['forgot-password'];
    }

    return {
      title: '',
      sub: '',
    };
  }, [location.pathname]);
  return (
    <>
      <div tw='max-w-[400px] mx-auto mt-12'>
        <h1 tw='text-2xl font-medium text-center'>{titleAndSub.title}</h1>
        <span tw='text-neutral-500 text-center block mt-3'>
          {titleAndSub.sub}
        </span>
      </div>
      <div tw='flex flex-col max-w-[400px] mx-auto border p-6 rounded-lg border-neutral-300 mt-8 '>
        <Outlet />
      </div>
    </>
  );
};
