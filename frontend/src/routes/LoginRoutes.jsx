import { lazy } from 'react';
import AuthLayout from '../layout/Auth/index';
import Loadable from 'components/Loadable';

const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));

const LoginRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: <LoginPage />
    },
  ]
};

export default LoginRoutes;
