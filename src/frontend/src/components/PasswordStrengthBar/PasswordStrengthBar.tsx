import React, { useEffect } from 'react';
import tw from 'twin.macro';
import {
  calculatePasswordStrength,
  defaultPasswordRequirements,
  PasswordRequirements,
} from '../../utils/calculatePasswordStrength';

export interface PasswordStrengthBarProps {
  password: string;
  requirements?: PasswordRequirements;
}

export const PasswordStrengthBar = React.memo(
  ({
    password,
    requirements = defaultPasswordRequirements,
  }: PasswordStrengthBarProps) => {
    const [strength, setStrength] = React.useState(0);

    useEffect(() => {
      setStrength(calculatePasswordStrength(password, requirements));
    }, [password]);

    const strengthName = React.useMemo(() => {
      if (strength >= 80) return 'Very Strong';
      if (strength >= 65) return 'Strong';
      if (strength >= 40) return 'Good';
      if (strength >= 25) return 'Weak';
      if (strength > 0) return 'Very Weak';
      return 'Too short';
    }, [strength]);

    const color = React.useMemo(() => {
      if (strength >= 80) return tw`bg-green-700`;
      if (strength >= 65) return tw`bg-green-700`;
      if (strength >= 40) return tw`bg-amber-700`;
      if (strength >= 25) return tw`bg-red-500`;
      if (strength > 0) return tw`bg-red-500`;
    }, [strength]);

    return (
      <div>
        <div tw='flex space-x-2'>
          <div
            css={[
              tw`pt-0.5 bg-gray-300 flex-1 rounded`,
              strength > 0 && color,
            ]}></div>
          <div
            css={[
              tw`pt-0.5 bg-gray-300 flex-1 rounded`,
              strength >= 25 && color,
            ]}></div>
          <div
            css={[
              tw`pt-0.5 bg-gray-300 flex-1 rounded`,
              strength >= 40 && color,
            ]}></div>
          <div
            css={[
              tw`pt-0.5 bg-gray-300 flex-1 rounded`,
              strength >= 65 && color,
            ]}></div>
          <div
            css={[
              tw`pt-0.5 bg-gray-300 flex-1 rounded`,
              strength >= 80 && color,
            ]}></div>
        </div>
        <div tw='text-right'>
          <span tw='font-medium text-neutral-500'>{strengthName}</span>
        </div>
      </div>
    );
  }
);