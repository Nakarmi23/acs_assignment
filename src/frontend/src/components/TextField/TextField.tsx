import { HTMLInputTypeAttribute, ReactNode, useId } from 'react';
import tw from 'twin.macro';
import { textFieldStyles } from '../../styles/textFieldStyles';

export interface TextFieldProps {
  label: ReactNode;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}

export const TextField = ({ label, placeholder, type }: TextFieldProps) => {
  const id = useId();
  return (
    <div tw='flex flex-col space-y-1.5'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        css={textFieldStyles}
        placeholder={placeholder}
      />
    </div>
  );
};
