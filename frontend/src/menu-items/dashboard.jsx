// assets
import { DashboardOutlined } from '@ant-design/icons';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { AppstoreOutlined } from '@ant-design/icons';
import {
  ProfileOutlined,
  UserOutlined,
  BankOutlined,
  NotificationOutlined,
  BellOutlined,
  TransactionOutlined,
  ShoppingOutlined,
  FileTextOutlined

} from '@ant-design/icons';
// icons
const icons = {
  DashboardOutlined,
  FileTextOutlined,
  ProfileOutlined,
  UserOutlined,
  BankOutlined,
  NotificationOutlined,
  BellOutlined,
  TransactionOutlined,
  SchoolOutlinedIcon,
  AppstoreOutlined,
  ShoppingOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/admin',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/dashboard/users',
      icon: icons.UserOutlined
    },
    {
      id: 'university',
      title: 'University',
      type: 'item',
      url: '/dashboard/university',
      icon: icons.SchoolOutlinedIcon,
    },
    {
      id: 'category',
      title: 'Category',
      type: 'item',
      url: '/dashboard/category',
      icon: icons.AppstoreOutlined,
    },
    {
      id: 'ads',
      title: 'Ads',
      type: 'item',
      url: '/dashboard/ads',
      icon: icons.NotificationOutlined,
    },
    {
      id: 'order',
      title: 'Order Listing',
      type: 'item',
      url: '/dashboard/orders',
      icon: icons.ShoppingOutlined,
    },
    {
      id: 'Report',
      title: 'Report Logs',
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.FileTextOutlined,
    }
    ,
    {
      id: 'notification',
      title: 'Notification',
      type: 'item',
      url: '/dashboard/notifications',
      icon: icons.BellOutlined,
    },
    {
      id: 'Transactions',
      title: 'Transactions',
      type: 'item',
      url: '/dashboard/transactions',
      icon: icons.TransactionOutlined,
    },

  ]
};

export default dashboard;
