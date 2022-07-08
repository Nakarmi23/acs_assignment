import React, { useEffect, useMemo } from 'react';
import tw from 'twin.macro';
import {
  calculatePasswordStrength,
  defaultPasswordRequirements,
  PasswordRequirements,
} from '../../utils/calculatePasswordStrength';

export interface PasswordStrengthBarProps {
  password: string;
  requirements?: PasswordRequirements;
  onStrengthChange?: (strength: number) => void;
}

const passwordStrengthLabelAndColors = {
  //  if strength greater or equals to 80
  gteq80: {
    label: 'Very Strong',
    color: tw`bg-green-700`,
  },
  //  if strength greater or equals to 65
  gteq65: {
    label: 'Strong',
    color: tw`bg-green-700`,
  },
  //  if strength greater or equals to 40
  gteq40: {
    label: 'Good',
    color: tw`bg-amber-700`,
  },
  //  if strength greater or equals to 25
  gteq25: {
    label: 'Weak',
    color: tw`bg-red-500`,
  },
  //  if strength greater than 80
  gt0: {
    label: 'Very Weak',
    color: tw`bg-red-500`,
  },
  //  if strength equals to 0
  eq0: {
    label: 'Too short',
    color: undefined,
  },
};

export const PasswordStrengthBar = React.memo(
  ({
    password,
    requirements = defaultPasswordRequirements,
    onStrengthChange,
  }: PasswordStrengthBarProps) => {
    const strength = React.useMemo(
      () => calculatePasswordStrength(password, requirements),
      [password, requirements]
    );

    useEffect(() => {
      onStrengthChange && onStrengthChange(strength);
    }, [strength]);

    const { color, label } = useMemo(() => {
      if (strength >= 80) return passwordStrengthLabelAndColors['gteq80'];
      if (strength >= 65) return passwordStrengthLabelAndColors['gteq65'];
      if (strength >= 40) return passwordStrengthLabelAndColors['gteq40'];
      if (strength >= 25) return passwordStrengthLabelAndColors['gteq25'];
      if (strength > 0) return passwordStrengthLabelAndColors['gt0'];
      return passwordStrengthLabelAndColors['eq0'];
    }, [strength]);

    return (
      <div>
        <div tw='flex space-x-2'>
          <div
            css={[
              tw`flex-1 pt-1 bg-gray-300 rounded`,
              strength > 0 && color,
            ]}></div>
          <div
            css={[
              tw`flex-1 pt-1 bg-gray-300 rounded`,
              strength >= 25 && color,
            ]}></div>
          <div
            css={[
              tw`flex-1 pt-1 bg-gray-300 rounded`,
              strength >= 40 && color,
            ]}></div>
          <div
            css={[
              tw`flex-1 pt-1 bg-gray-300 rounded`,
              strength >= 65 && color,
            ]}></div>
          <div
            css={[
              tw`flex-1 pt-1 bg-gray-300 rounded`,
              strength >= 80 && color,
            ]}></div>
        </div>
        <div tw='text-right'>
          <span tw='font-medium text-neutral-500'>{label}</span>
        </div>
      </div>
    );
  }
);
