import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import React from 'react';
import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import { TextField } from '../../../components/TextField/TextField';
import { PasswordStrengthBar } from '../../../components/PasswordStrengthBar/PasswordStrengthBar';
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import passwordRegex from '../../../utils/passRegex';
import { useAppDispatch } from '../../../store';
import { saveSessionUser } from '../../../feature/auth/auth-slice';

const formSchema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email. For example: foobar@gmail.com')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
    captcha: yup.string().required('Captcha is required'),
  })
  .required();

type FormSchemaType = yup.TypeOf<typeof formSchema>;

export const Login = () => {
  const capRef = useRef<Reaptcha>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    setValue,
    clearErrors,
  } = useForm<FormSchemaType>({
    defaultValues: {
      email: '',
      password: '',
      captcha: '',
    },
    resolver: yupResolver(formSchema),
  });
  const [manualError, setManualError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(async (data: FormSchemaType) => {
    setIsLoading(true);
    setManualError(null);
    axios
      .post('/api/auth/login', data)
      .then((res) => {
        dispatch(saveSessionUser(res.data));
      })
      .catch((err: any) => {
        setManualError(err.response.data.message);
        capRef.current?.reset();
        resetField('captcha');
        setValue('captcha', '');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);

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
        <Link to='/account/register' tw='text-blue-700 hover:text-blue-800'>
          Don't have an account?
        </Link>
        <Link
          to='/account/forgot-password'
          tw='text-blue-700 hover:text-blue-800'>
          Forgot password?
        </Link>
      </div>
      <Reaptcha
        ref={capRef}
        sitekey='6LdIJocgAAAAAJ6aaBxaHYKvQoydkycZmI1ffG3Y'
        onVerify={(e) => {
          clearErrors('captcha');
          setValue('captcha', e!);
        }}
      />
      <PrimaryButton disable={hasError || isLoading} isLoading={isLoading}>
        LOG IN
      </PrimaryButton>
    </form>
  );
};
