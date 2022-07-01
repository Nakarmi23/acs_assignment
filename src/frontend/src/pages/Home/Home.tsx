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
            (Recommends password change if the user has not changed their
            password for 60 or more days. Please check the{' '}
            <strong>Readme.md</strong> file for testing this feature.)
          </small>
        </li>
        <li>
          Rate Limit on all API endpoints{' '}
          <small>
            (Block users for 15 mins if number of requests exceeds 15 within 5
            seconds )
          </small>
        </li>
      </ul>
    </>
  );
};
