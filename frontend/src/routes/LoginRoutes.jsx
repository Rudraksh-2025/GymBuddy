import { lazy } from 'react';
import AuthLayout from '../layout/Auth/index';
import Loadable from 'components/Loadable';

const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')))
const VerifyPage = Loadable(() => import('pages/auth/Verify'))

const LoginRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'register',
      element: <RegisterPage />
    },
    {
      path: 'verification',
      element: <VerifyPage />
    }
  ]
};

export default LoginRoutes;
