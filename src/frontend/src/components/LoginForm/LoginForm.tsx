import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Reaptcha from 'reaptcha';
import * as yup from 'yup';
import { buttonDisabledStyles, buttonStyles } from '../../styles/buttonStyles';
import { TextField } from '../TextField/TextField';

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

export const LoginForm = () => {
  const navigate = useNavigate();
  const capRef = useRef<Reaptcha>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(formSchema),
  });
  const [manualError, setManualError] = useState<string | null>(null);

  const onSubmit = useCallback(async (data: FormSchemaType) => {
    setManualError(null);
    axios
      .post('/api/auth/login', data)
      .then(() => navigate('/home'))
      .catch((err: any) => {
        setManualError(err.response.data.message);
        capRef.current?.reset();
      });
  }, []);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);

  return (
    <form tw='flex flex-col space-y-6' onSubmit={handleSubmit(onSubmit)}>
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
        <div></div>
        <button tw='text-blue-700 hover:text-blue-800'>Forgot password?</button>
      </div>
      <Reaptcha
        ref={capRef}
        sitekey='6LdIJocgAAAAAJ6aaBxaHYKvQoydkycZmI1ffG3Y'
        onVerify={(e) => setValue('captcha', e!)}
      />
      <button css={buttonStyles}>LOG IN</button>
    </form>
  );
};
