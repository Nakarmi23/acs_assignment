import { yupResolver } from '@hookform/resolvers/yup';
import * as _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  })
  .required()
  .test('confirmPassword', (value, context) => {
    console.log(value, context);
    if (value.confirmPassword !== value.password)
      return context.createError({
        path: 'confirmPassword',
        message: 'Password does not match',
      });

    return false;
  });

type FormSchemaType = yup.TypeOf<typeof formSchema>;

export const SignupForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
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

  const onSubmit = useCallback((data: FormSchemaType) => {
    console.log(data);
  }, []);

  const hasError = useMemo(() => !_.isEmpty(errors), [JSON.stringify(errors)]);

  return (
    <form tw='flex flex-col space-y-5'>
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
      <button
        css={[buttonStyles, hasError && buttonDisabledStyles]}
        onClick={handleSubmit(onSubmit)}
        disabled={hasError}>
        SIGN UP
      </button>
    </form>
  );
};
