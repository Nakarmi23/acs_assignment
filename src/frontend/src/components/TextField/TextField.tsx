import React, { HTMLInputTypeAttribute, ReactNode, useId } from 'react';
import tw from 'twin.macro';
import { textFieldStyles } from '../../styles/textFieldStyles';

export interface TextFieldProps {
  label: ReactNode;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  autoFocus?: boolean;
}

export const TextField = React.forwardRef(
  (
    {
      label,
      placeholder,
      type,
      value,
      onChange,
      name,
      onBlur,
      helperText,
      error,
      autoFocus,
    }: TextFieldProps,
    ref?: React.ForwardedRef<HTMLInputElement>
  ) => {
    const id = useId();
    return (
      <div tw='flex flex-col space-y-1.5'>
        <label htmlFor={id}>{label}</label>
        <input
          ref={ref}
          id={id}
          type={type}
          css={[
            textFieldStyles,
            error && tw`border-red-500! ring-1! ring-red-500!`,
          ]}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
        {helperText && (
          <span css={[tw`text-sm text-neutral-500`, error && tw`text-red-500`]}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
