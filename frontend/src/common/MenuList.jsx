import {
    DashboardOutlined,
    UserOutlined,
    FormOutlined,
    LogoutOutlined
} from '@ant-design/icons';

export const menuList = [
    {
        id: "home",
        name: "Dashboard",
        path: "/home",
        icon: DashboardOutlined,
    },
    {
        id: "users",
        name: "List of Users",
        path: "/home/users",
        icon: UserOutlined,
        info: "User Information",
        view: "Users",
        edit: "Edit User"
    },
    {
        id: "exercise",
        name: "Exercise",
        path: "/home/exercise",
        icon: FormOutlined,
        info: "Exercise Information",
    },
    {
        id: "logout",
        name: "Logout",
        path: "/logout",
        icon: LogoutOutlined,
    },
];


