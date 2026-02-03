import {
    DashboardOutlined,
    UserOutlined,
    FormOutlined,
    LogoutOutlined,
    BarChartOutlined,
    CoffeeOutlined,
    FireOutlined, TrophyOutlined,
} from '@ant-design/icons';

const icons = {
    DashboardOutlined,
    UserOutlined,
    FormOutlined,
    LogoutOutlined,
    BarChartOutlined,
    CoffeeOutlined,
    FireOutlined, TrophyOutlined,
};

export const menuList = [
    {
        id: "home",
        name: "Dashboard",
        path: "/home",
        icon: icons.DashboardOutlined,
    },
    {
        id: "leaderboard",
        name: "Leaderboard",
        path: "/home/leaderboard",
        icon: icons.TrophyOutlined,
        info: "Friends Leaderboard",
    },
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
        id: "food",
        name: "Food Tracking",
        path: "/home/food",
        icon: icons.CoffeeOutlined,
        info: "Food Tracking Information",
    },
    {
        id: "calorie",
        name: "Calorie Tracking",
        path: "/home/calorie",
        icon: icons.FireOutlined,
        info: "Calorie Tracking Information",
    },
    {
        id: "logout",
        name: "Logout",
        path: "/logout",
        icon: icons.LogoutOutlined,
    },
];


