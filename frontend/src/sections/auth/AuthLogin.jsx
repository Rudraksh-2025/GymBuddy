import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

// material-ui
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useLogin } from '../../api/ApiCall';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';


export default function AuthLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isLoading } = useLogin();


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          role: 'Admin',
          fcm_token: "fcm_token",
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test(
              'no-leading-trailing-whitespace',
              'Password cannot start or end with spaces',
              (value) => value === value?.trim()
            )
            .test(
              'min-length',
              'Password must be at least 8 characters long',
              (value) => value?.length >= 8
            )
            .test(
              'has-uppercase',
              'Password must contain at least one uppercase letter',
              (value) => /[A-Z]/.test(value || '')
            )
            .test(
              'has-lowercase',
              'Password must contain at least one lowercase letter',
              (value) => /[a-z]/.test(value || '')
            )
            .test(
              'has-number',
              'Password must contain at least one number',
              (value) => /\d/.test(value || '')
            )
            .test(
              'has-special-char',
              'Password must contain at least one special character',
              (value) => /[\W_]/.test(value || '')
            )
        })}
        onSubmit={(values, { setSubmitting }) => {
          login(
            {
              email: values.email,
              password: values.password,
              role: 'Admin',
              fcm_token: "fcm_token",
            },
            {
              onSuccess: () => {
                toast.success('Login successful');
              },
              onError: (error) => {
                const errorList = error?.response?.data?.error?.error;

                if (Array.isArray(errorList)) {
                  errorList.forEach((err) => {
                    toast.error(err.message);
                  });
                } else {
                  toast.error(error?.response?.data?.message || 'Something went wrong');
                }
              },
              onSettled: () => {
                setSubmitting(false);
              }
            }
          );
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Link variant="h6" component={RouterLink} to="#" color="text.primary">
                    Forgot Password?
                  </Link>
                  <Link component={RouterLink} to={'/register'}>
                    <Typography variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                      Don&apos;t have an account?
                    </Typography></Link>
                </Stack>

              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button type="submit" sx={{ color: 'white' }} fullWidth size="large" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik >
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
