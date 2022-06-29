import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import * as _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';
import * as yup from 'yup';
import { buttonDisabledStyles, buttonStyles } from '../../styles/buttonStyles';
import { PasswordStrengthBar } from '../PasswordStrengthBar/PasswordStrengthBar';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
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
    formState: { errors, dirtyFields, isSubmitted },
    watch,
    setError,
    getValues,
    clearErrors,
  } = useForm<FormSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const [manualError, setManualError] = useState<string | null>(null);

  const onSubmit = useCallback((data: FormSchemaType) => {
    setIsLoading(true);
    setManualError(null);
    axios
      .post('/api/user', data)
      .then(() => navigate('/account/login'))
      .catch((err: any) => {
        setManualError(err.response.data.message);
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
    <form tw='flex flex-col space-y-5' onSubmit={handleSubmit(onSubmit)}>
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
      <PrimaryButton disable={hasError || isLoading} isLoading={isLoading}>
        SIGN UP
      </PrimaryButton>
    </form>
  );
};
