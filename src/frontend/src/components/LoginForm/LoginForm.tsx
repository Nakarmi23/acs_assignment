import { buttonDisabledStyles, buttonStyles } from '../../styles/buttonStyles';
import { TextField } from '../TextField/TextField';
import tw from 'twin.macro';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import _ from 'lodash';

const formSchema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email. For example: foobar@gmail.com')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
    rememberMe: yup.boolean().default(false),
  })
  .required();

type FormSchemaType = yup.TypeOf<typeof formSchema>;

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = useCallback((data: FormSchemaType) => {
    console.log(data);
  }, []);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);

  return (
    <form tw='flex flex-col space-y-6'>
      <Controller
        control={control}
        name='email'
        render={({ field, fieldState: { error } }) => (
          <TextField
            label='Email'
            placeholder='Enter your email address'
            type='email'
            autoFocus
            error={!!error}
            helperText={error?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='password'
        render={({ field, fieldState: { error } }) => (
          <TextField
            label='Password'
            placeholder='Enter your password'
            type='password'
            error={!!error}
            helperText={error?.message}
            {...field}
          />
        )}
      />
      <div tw='flex justify-between'>
        <label tw='flex items-center select-none'>
          <Controller
            control={control}
            name='rememberMe'
            render={({ field: { onChange, value, ...field } }) => (
              <input
                type='checkbox'
                tw='border-neutral-300 rounded cursor-pointer'
                {...field}
                checked={value}
                onChange={(e) => {
                  onChange(e.currentTarget.checked);
                }}
              />
            )}
          />
          <span tw='text-neutral-700 ml-2 '>Remember me</span>
        </label>
        <button tw='text-blue-700 hover:text-blue-800'>Forgot password</button>
      </div>
      <button
        css={[buttonStyles, hasError && buttonDisabledStyles]}
        onClick={handleSubmit(onSubmit)}
        disabled={hasError}>
        LOG IN
      </button>
    </form>
  );
};
