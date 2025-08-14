import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from './AuthGaurd';
import { Navigate } from 'react-router-dom';
// import AuthLayout from '../layout/Auth/index'
const UserPage = Loadable(lazy(() => import('../pages/Users/UserPage')));
const ListOfUsers = Loadable(lazy(() => import('../pages/Users/ListOfUsers')));
const ViewProfile = Loadable(lazy(() => import('../pages/profile/ViewProfile')));
const Category = Loadable(lazy(() => import('../pages/Category/Category')));
// import 
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

const MainRoutes = {
  path: '/',
  element: <AuthGuard />,
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard/admin" replace />
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'admin',
              element: <DashboardDefault />
            },
            {
              path: 'Users',
              element: <ListOfUsers />
            },
            {
              path: 'users/:userId',
              element: <UserPage />
            },
            {
              path: 'category',
              element: <Category />
            },
            {
              path: 'view-profile',
              element: <ViewProfile />
            },

          ]
        },
      ]
    }
  ]
};

export default MainRoutes;
