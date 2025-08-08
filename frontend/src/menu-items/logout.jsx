// assets
import {
LogoutOutlined
} from '@ant-design/icons';
// icons
const icons = {
 LogoutOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const logout= {
  id: 'logout',
  title: '',
  type: 'group',
  children: [
    {
      id: 'logout',
      title: 'logout',
      type: 'item',
      url: '/login',
      icon: icons.LogoutOutlined,
      breadcrumbs: false,
      onClick: true,
    },
  ]
};

export default logout;
