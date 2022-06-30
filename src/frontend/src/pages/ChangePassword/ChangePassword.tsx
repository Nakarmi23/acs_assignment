import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { PasswordStrengthBar } from '../../components/PasswordStrengthBar/PasswordStrengthBar';
import { TextField } from '../../components/TextField/TextField';
import { buttonDisabledStyles, buttonStyles } from '../../styles/buttonStyles';
import React from 'react';
import tw from 'twin.macro';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { useAppDispatch } from '../../store';
import { saveSessionUser } from '../../feature/auth/auth-slice';
import Reaptcha from 'reaptcha';

const formSchema = yup
  .object({
    oldPassword: yup.string().required('Password is required'),
    password: yup.string().required('Password is required'),
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

export const ChangePassword = () => {
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
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(formSchema),
  });
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);
  const [manualError, setManualError] = useState<string | null>(null);

  const onSubmit = useCallback((data: FormSchemaType) => {
    setIsLoading(true);
    setManualError(null);
    axios
      .post('/api/user/change-password', data)
      .then((res) => {
        dispatch(saveSessionUser(res.data));
        navigate('/');
      })
      .catch((err: any) => {
        setManualError(err.response.data.message);
        capRef.current?.reset();
        resetField('captcha');
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
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [watch('password')]);

  return (
    <>
      <h1 tw='text-2xl font-medium'>Change Password</h1>
      <form tw='space-y-5 mt-8' onSubmit={handleSubmit(onSubmit)}>
        {manualError && (
          <div tw='border border-red-300 rounded p-3 bg-red-100 text-red-700 font-medium'>
            {manualError}
          </div>
        )}
        <Controller
          control={control}
          name='oldPassword'
          render={({ field, fieldState: { error } }) => (
            <TextField
              label='Old Password'
              placeholder='Enter your old password'
              type='password'
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
              label='New Password'
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
        <Reaptcha
          ref={capRef}
          sitekey='6LdIJocgAAAAAJ6aaBxaHYKvQoydkycZmI1ffG3Y'
          onVerify={(e) => {
            clearErrors('captcha');
            setValue('captcha', e!);
          }}
        />
        <PrimaryButton isLoading={isLoading} disable={hasError || isLoading}>
          Change Password
        </PrimaryButton>
      </form>
    </>
  );
};
