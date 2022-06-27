import { buttonStyles } from '../../styles/buttonStyles';

export const Home = () => {
  return (
    <div tw='text-center'>
      <h1 tw='text-2xl font-medium'>
        You have succefully logged in!! Welcome to ACS Assignment
      </h1>
      <button css={buttonStyles}>LOG OUT</button>
    </div>
  );
};
