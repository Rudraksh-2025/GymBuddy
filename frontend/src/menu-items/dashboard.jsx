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
  FileTextOutlined,
  FormOutlined
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
  FormOutlined
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
      id: 'exercise',
      title: 'Exercise',
      type: 'item',
      url: '/dashboard/exercise',
      icon: icons.FormOutlined,
    },

  ]
};

export default dashboard;
