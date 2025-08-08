// assets
import {
  ShoppingCartOutlined,
  HomeOutlined,
  StarOutlined,
} from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined,
  HomeOutlined,
  StarOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'Listings',
  title: 'Total Listings',
  type: 'group',
  children: [

    {
      id: 'products',
      title: 'Market Place',
      type: 'item',
      url: '/dashboard/products',
      icon: icons.ShoppingCartOutlined
    },
    {
      id: 'Sub Lease',
      title: 'Sub Lease',
      type: 'item',
      url: '/dashboard/sublease',
      icon: icons.HomeOutlined
    },
    {
      id: 'boosted',
      title: 'Boosted Listing',
      type: 'item',
      url: '/dashboard/boosted',
      icon: icons.StarOutlined
    },

  ]
};

export default pages;
