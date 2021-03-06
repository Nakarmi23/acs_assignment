import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { PasswordStrengthBar } from '../../../components/PasswordStrengthBar/PasswordStrengthBar';
import { TextField } from '../../../components/TextField/TextField';
import {
  buttonDisabledStyles,
  buttonStyles,
} from '../../../styles/buttonStyles';
import React from 'react';
import tw from 'twin.macro';
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import Reaptcha from 'reaptcha';
import passwordRegex from '../../../utils/passRegex';

const formSchema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email. For example: foobar@gmail.com')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(passwordRegex, {
        message:
          'Use 8 or more characters with a mix of uppercase and lowercase letters, numbers & symbols',
      }),
    confirmPassword: yup.string().required('Confirm password is required'),
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

export const PasswordReset = () => {
  const navigate = useNavigate();
  const capRef = useRef<Reaptcha>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted },
    watch,
    setError,
    getValues,
    setValue,
    clearErrors,
    resetField,
  } = useForm<FormSchemaType>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
    },
    resolver: yupResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);
  const [manualError, setManualError] = useState<string | null>(null);

  const onSubmit = useCallback((data: FormSchemaType) => {
    setIsLoading(true);
    setManualError(null);
    axios
      .post('/api/user/password-reset', data)
      .then(() => navigate('/account/login'))
      .catch((err: any) => {
        setManualError(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // patch for confirm password not revalidating when updating password field
  useEffect(() => {
    if (dirtyFields.confirmPassword && isSubmitted) {
      if (getValues('password') !== getValues('confirmPassword')) {
        setError('confirmPassword', { message: 'Password does not match' });
        capRef.current?.reset();
        resetField('captcha');
        setValue('captcha', '');
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [watch('password')]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} tw='space-y-5 flex flex-col'>
      {manualError && (
        <div tw='border border-red-300 rounded p-3 bg-red-100 text-red-700 font-medium'>
          {manualError}
        </div>
      )}
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
            helperText={
              error
                ? error.message
                : 'Use 8 or more characters with a mix of uppercase and lowercase letters, numbers & symbols'
            }
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
      <Reaptcha
        ref={capRef}
        sitekey='6LdIJocgAAAAAJ6aaBxaHYKvQoydkycZmI1ffG3Y'
        onVerify={(e) => {
          clearErrors('captcha');
          setValue('captcha', e!);
        }}
      />
      <PrimaryButton isLoading={isLoading} disable={hasError || isLoading}>
        RESET PASSWORD
      </PrimaryButton>
      <div tw='flex space-x-8 items-center'>
        <hr tw='flex-1 border-t-2' />
        <h6>OR</h6>
        <hr tw='flex-1 border-t-2' />
      </div>
      <PrimaryButton
        onClick={() => navigate('/account/login')}
        isLoading={isLoading}
        disable={isLoading}>
        LOG IN
      </PrimaryButton>
    </form>
  );
};
