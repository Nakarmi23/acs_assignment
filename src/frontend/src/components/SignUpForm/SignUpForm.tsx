import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import * as _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Reaptcha from 'reaptcha';
import * as yup from 'yup';
import { buttonDisabledStyles, buttonStyles } from '../../styles/buttonStyles';
import { PasswordStrengthBar } from '../PasswordStrengthBar/PasswordStrengthBar';
import { TextField } from '../TextField/TextField';

const formSchema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Please enter a valid email. For example: foobar@gmail.com')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string().required('Confirm password is required'),
    termsCondition: yup
      .boolean()
      .default(false)
      .isTrue('You must accept the terms and conditions'),
    captcha: yup.string().required('Captcha is required'),
  })
  .required()
  .test('confirmPassword', (value, context) => {
    if (value.confirmPassword !== value.password)
      return context.createError({
        path: 'confirmPassword',
        message: 'Password does not match',
      });

    return true;
  });

type FormSchemaType = yup.TypeOf<typeof formSchema>;

export const SignupForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setValue,
    setError,
    getValues,
    clearErrors,
  } = useForm<FormSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsCondition: false,
    },
    resolver: yupResolver(formSchema),
  });

  const [manualError, setManualError] = useState<string | null>(null);

  const onSubmit = useCallback((data: FormSchemaType) => {
    axios
      .post('/api/user', data)
      .then(() => navigate('/account/login'))
      .catch((err: any) => {
        setManualError(err.response.data.message);
      });
  }, []);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);

  // patch for confirm password not revalidating when updating password field
  useEffect(() => {
    if (dirtyFields.confirmPassword) {
      if (getValues('password') !== getValues('confirmPassword')) {
        setError('confirmPassword', { message: 'Password does not match' });
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [watch('password')]);

  return (
    <form tw='flex flex-col space-y-5'>
      {manualError && (
        <div tw='border border-red-300 rounded p-3 bg-red-100 text-red-700 font-medium'>
          {manualError}
        </div>
      )}
      <Controller
        control={control}
        name='name'
        render={({ field, fieldState: { error } }) => (
          <TextField
            label='Name'
            placeholder='Enter full name'
            type='text'
            autoFocus
            error={!!error}
            helperText={error?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='email'
        render={({ field, fieldState: { error } }) => (
          <TextField
            label='Email'
            placeholder='Enter your email address'
            type='email'
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
            placeholder='Enter a strong password'
            type='password'
            error={!!error}
            helperText={error?.message}
            {...field}
          />
        )}
      />
      <div>
        <PasswordStrengthBar password={watch('password') ?? ''} />
        <Controller
          control={control}
          name='confirmPassword'
          render={({ field, fieldState: { error } }) => (
            <TextField
              label='Confirm Password'
              placeholder='Repeat your password'
              type='password'
              error={!!error}
              helperText={error?.message}
              {...field}
            />
          )}
        />
      </div>
      <div tw='flex justify-between'>
        <label
          tw='flex items-center select-none'
          title='You must accept the terms and conditions'>
          <Controller
            control={control}
            name='termsCondition'
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
          <span tw='text-neutral-700 ml-2 '>
            I accept the{' '}
            <a href='#' tw='text-blue-700'>
              Terms & Conditions
            </a>
          </span>
        </label>
      </div>
      <Reaptcha
        sitekey='6LdIJocgAAAAAJ6aaBxaHYKvQoydkycZmI1ffG3Y'
        onVerify={(e) => setValue('captcha', e!)}
      />
      <button
        css={[buttonStyles, hasError && buttonDisabledStyles]}
        onClick={handleSubmit(onSubmit)}
        disabled={hasError}>
        SIGN UP
      </button>
    </form>
  );
};
