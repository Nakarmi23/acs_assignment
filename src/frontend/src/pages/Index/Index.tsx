import axios from 'axios';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { removeSessionUser } from '../../feature/auth/auth-slice';
import IUser from '../../model/user';
import { RootState, useAppDispatch } from '../../store';
import tw, { styled } from 'twin.macro';
import { NavLink, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';

const StyledNavLink = styled(NavLink)(() => ({
  ...tw`p-2 rounded hover:bg-neutral-100`,
  '&.active': {
    ...tw`bg-neutral-100`,
  },
}));

export const Index = () => {
  const sessionUser = useSelector<RootState, IUser>(
    (store) => store.auth.user!
  );
  const dispatch = useAppDispatch();

  const onLogoutClick = useCallback(() => {
    axios.post('/api/auth/logout', {}).then(() => {
      dispatch(removeSessionUser());
    });
  }, []);

  const isPass60DaysOld = useMemo(
    () =>
      dayjs(new Date()).diff(sessionUser.lastPasswordUpdateDate, 'days') >= 60,
    [sessionUser.lastPasswordUpdateDate]
  );

  return (
    <div tw='max-w-[600px] mx-auto mt-32 pb-32'>
      <header tw='flex justify-between items-center'>
        <h1 tw='text-2xl font-medium'>Welcome, {sessionUser.name}</h1>
      </header>
      {/* Show alert if user has not changed their password for 60 or more days */}
      {sessionUser.lastPasswordUpdateDate && isPass60DaysOld && (
        <div tw='border p-6 rounded-lg mt-4 border-yellow-700 bg-yellow-200 '>
          <p tw='text-yellow-700 font-medium'>
            It seem like you have not changed your password for quite a while.
            For security reasons please change your password by clicking here or
            the "Change Password" link below.
          </p>
        </div>
      )}
      <div tw='flex mt-4 space-x-4 items-start'>
        <main tw='w-8/12 border p-6 rounded-lg border-neutral-300'>
          <Outlet />
        </main>
        <aside tw='border p-6 rounded-lg border-neutral-300 w-4/12 space-y-1.5'>
          <h6 tw='font-medium text-lg'>Links</h6>
          <nav tw='flex flex-col space-y-1.5'>
            <StyledNavLink to='/'>Home</StyledNavLink>
            <StyledNavLink to='/change-password'>Change Password</StyledNavLink>
          </nav>
          <hr />
          <button
            tw='flex items-center space-x-3 hover:(bg-opacity-20 bg-red-500) px-2.5 py-1.5 rounded text-red-500 w-full'
            onClick={onLogoutClick}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              tw='w-6 h-6'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                clipRule='evenodd'
              />
            </svg>
            <span>LOG OUT</span>
          </button>
        </aside>
      </div>
    </div>
  );
};
