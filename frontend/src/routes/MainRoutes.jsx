import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from './AuthGaurd';
import { Navigate } from 'react-router-dom';
// import AuthLayout from '../layout/Auth/index'
const UserPage = Loadable(lazy(() => import('../pages/Users/UserPage')));
const ProductDetail = Loadable(lazy(() => import('../pages/MarkertPlace/ProductDetailPage')));
const SubleaseDetail = Loadable(lazy(() => import('../pages/SubLease/SubleaseDetailPage')));
const ListOfUsers = Loadable(lazy(() => import('../pages/Users/ListOfUsers')));
const ListOfProducts = Loadable(lazy(() => import('../pages/MarkertPlace/ListofProducts')));
const ListOfSublease = Loadable(lazy(() => import('../pages/SubLease/ListOfSublease')));
const ListOfUniversities = Loadable(lazy(() => import('../pages/Universities/ListOfUniversities')));
const Notification = Loadable(lazy(() => import('../pages/notification/Notification')));
const AdModule = Loadable(lazy(() => import('../pages/AdModule/AdModule')));
const ViewProfile = Loadable(lazy(() => import('../pages/profile/ViewProfile')));
const BoostedDetail = Loadable(lazy(() => import('../pages/Boosted/BoostedDetail')));
const ListOfBoosted = Loadable(lazy(() => import('../pages/Boosted/ListOfBoosted')));
const ListOfTransactions = Loadable(lazy(() => import('../pages/Transaction/ListOfTransactions')));
const NewActiveUsers = Loadable(lazy(() => import('../pages/Users/NewActiveUsers')));
const Category = Loadable(lazy(() => import('../pages/Category/Category')));
const ListOfOrders = Loadable(lazy(() => import('../pages/Orders/ListOfOrders')));
const Report = Loadable(lazy(() => import('../pages/Report/Report')));

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
              path: 'NewActiveUsers',
              element: <NewActiveUsers />
            },
            {
              path: 'users/:userId',
              element: <UserPage />
            },
            {
              path: 'products/:productId',
              element: <ProductDetail />
            },
            {
              path: 'reports',
              element: <Report />
            },
            {
              path: 'orders',
              element: <ListOfOrders />
            },
            {
              path: 'sublease/:subleaseId',
              element: <SubleaseDetail />
            },
            {
              path: 'products',
              element: <ListOfProducts />
            },
            {
              path: 'sublease',
              element: <ListOfSublease />
            },
            {
              path: 'boosted',
              element: <ListOfBoosted />
            },
            {
              path: 'category',
              element: <Category />
            },
            {
              path: 'boosted/:boostedId',
              element: <BoostedDetail />
            },
            {
              path: 'university',
              element: <ListOfUniversities />
            },
            {
              path: 'notifications',
              element: <Notification />
            },
            {
              path: 'transactions',
              element: <ListOfTransactions />
            },
            {
              path: 'view-profile',
              element: <ViewProfile />
            },
            {
              path: 'ads',
              element: <AdModule />
            },

          ]
        },
      ]
    }
  ]
};

export default MainRoutes;
