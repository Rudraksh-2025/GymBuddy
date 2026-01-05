import {
    DashboardOutlined,
    UserOutlined,
    FormOutlined,
    LogoutOutlined,
    BarChartOutlined,
    CoffeeOutlined,
} from '@ant-design/icons';

const icons = {
    DashboardOutlined,
    UserOutlined,
    FormOutlined,
    LogoutOutlined,
    BarChartOutlined,
    CoffeeOutlined
};

export const menuList = [
    {
        id: "home",
        name: "Dashboard",
        path: "/home",
        icon: icons.DashboardOutlined,
    },
    // {
    //     id: "users",
    //     name: "List of Users",
    //     path: "/home/users",
    //     icon: icons.UserOutlined,
    //     info: "User Information",
    //     view: "Users",
    //     edit: "Edit User"
    // },
    {
        id: "exercise",
        name: "Exercise",
        path: "/home/exercise",
        icon: icons.FormOutlined,
        info: "Exercise Information",
    },
    {
        id: "weight",
        name: "Weight Tracking",
        path: "/home/weight",
        icon: icons.BarChartOutlined,
        info: "Weight Tracking Information",
    },
    {
        id: "calorie",
        name: "Calorie Tracking",
        path: "/home/calorie",
        icon: icons.CoffeeOutlined,
        info: "Calorie Tracking Information",
    },
    {
        id: "logout",
        name: "Logout",
        path: "/logout",
        icon: icons.LogoutOutlined,
    },
];


