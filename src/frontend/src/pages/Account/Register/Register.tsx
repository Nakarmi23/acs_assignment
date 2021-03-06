import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import React from 'react';
import tw from 'twin.macro';
import Recaptcha from 'reaptcha';
import { TextField } from '../../../components/TextField/TextField';
import { PasswordStrengthBar } from '../../../components/PasswordStrengthBar/PasswordStrengthBar';
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import passwordRegex from '../../../utils/passRegex';

const formSchema = yup
  .object({
    name: yup.string().required('Name is required'),
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

export const Register = () => {
  const navigate = useNavigate();
  const capRef = useRef<Recaptcha>(null);
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
    },
    resolver: yupResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const [manualError, setManualError] = useState<string | null>(null);

  const onSubmit = useCallback((data: FormSchemaType) => {
    setIsLoading(true);
    setManualError(null);
    axios
      .post('/api/user/register', data)
      .then(() => navigate('/account/login'))
      .catch((err: any) => {
        setManualError(err.response.data.message);
        capRef.current?.reset();
        resetField('captcha');
        setValue('captcha', '');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);

  // patch for confirm password not revalidating when updating password field
  useEffect(() => {
    if (dirtyFields.confirmPassword && isSubmitted) {
      if (getValues('password') !== getValues('confirmPassword')) {
        setError('confirmPassword', { message: 'Password does not match' });
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
      <div tw='flex justify-between'>
        <div />
        <Link to='/account/login' tw='text-blue-700 hover:text-blue-800'>
          Already have an account?
        </Link>
      </div>
      <Recaptcha
        ref={capRef}
        sitekey='6LdIJocgAAAAAJ6aaBxaHYKvQoydkycZmI1ffG3Y'
        onVerify={(e) => {
          clearErrors('captcha');
          setValue('captcha', e!);
        }}
      />
      <PrimaryButton disable={hasError || isLoading} isLoading={isLoading}>
        SIGN UP
      </PrimaryButton>
    </form>
  );
};
