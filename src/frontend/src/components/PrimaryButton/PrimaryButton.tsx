import { MouseEventHandler, PropsWithChildren } from 'react';
import tw from 'twin.macro';
import { buttonDisabledStyles, buttonStyles } from '../../styles/buttonStyles';

interface PrimaryButtonProps {
  disable: boolean;
  isLoading: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const PrimaryButton = ({
  disable,
  isLoading,
  onClick,
  children,
}: PropsWithChildren<PrimaryButtonProps>) => {
  return (
    <button
      onClick={onClick}
      css={[
        buttonStyles,
        disable && buttonDisabledStyles,
        tw`flex items-center justify-center`,
        isLoading && tw`cursor-not-allowed`,
      ]}
      disabled={disable}>
      {isLoading && (
        <svg
          tw='w-5 h-5 mr-3 -ml-1 text-white animate-spin'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'>
          <circle
            tw='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            stroke-width='4'></circle>
          <path
            tw='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
        </svg>
      )}
      <span>{isLoading ? 'Loading' : children}</span>
    </button>
  );
};
