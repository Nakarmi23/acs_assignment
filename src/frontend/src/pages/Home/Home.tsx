import React from 'react';

export const Home = () => {
  return (
    <>
      <h5 tw='font-medium text-2xl'>Home</h5>
      <p tw='mt-2'>This is my Advance Cyber Security Assignment.</p>
      <h6 tw='font-medium text-xl mt-2'>Implemented Features</h6>
      <ul tw='list-disc list-inside space-y-2 mt-2'>
        <li>Captcha v2</li>
        <li>Password Strength indicator</li>
        <li>Old password check</li>
        <li>
          Frequency of Change{' '}
          <small>
            (Recommends password change if the last password change date exceeds
            60 or more days.)
          </small>
        </li>
      </ul>
    </>
  );
};
