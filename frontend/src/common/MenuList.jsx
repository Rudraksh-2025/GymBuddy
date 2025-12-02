import notificationIcon from '../assets/images/notificationIcon.svg'
import repaymentIcon from '../assets/images/repaymentIcon.svg'
import rewardIcon from '../assets/images/rewardIcon.svg'
import settingIcon from '../assets/images/settingIcon.svg'
import Icon from '../assets/images/Icon.svg'
import reportIcon from '../assets/images/reportIcon.svg'
import subscriptionIcon from '../assets/images/subscriptionIcon.svg'
import issaunce from '../assets/images/issaunce.svg'
import userIcon from '../assets/images/userIcon.svg'
import logout from '../assets/images/logout.svg'
import ehailingAdmin from '../assets/images/ehailingAdmin.svg'
import ehailingReport from '../assets/images/ehailingReport.svg'
import { useState } from "react";

export const superadmin_menulist = [
    {
        id: "home",
        name: "Dashboard",
        path: "/home",
        icon: Icon,
    },
    {
        id: "users",
        name: "User Management",
        path: "/home/users",
        icon: userIcon,
        info: "User Information",
        view: "View Advance Usage by Users",
        edit: "Edit User"
    },

    // {
    //     id: "subscription",
    //     name: "Subscription Management",
    //     path: "/home/subscription",
    //     info: "Subscription Details",
    //     icon: subscriptionIcon,
    // },
    {
        id: "subscription",
        name: "Subscription Management",
        info: "Subscription Details",
        icon: subscriptionIcon,
        children: [
            { id: "subscription", name: "Advance Subscription Management", path: "/home/subscription", },
            { id: "vafSubscription", name: "VAF Subscription Management", path: "/home/subscription/vafSubscription" },
        ]
    },
    {
        id: "issuance",
        name: "Advance Issuance",
        path: "/home/issuance",
        info: 'Advance Requests & Approvals',
        icon: issaunce,
    },
    // {
    //     id: "repayment",
    //     name: "Repayment Oversight",
    //     path: "/home/repayment",
    //     info: "View Payment Details",
    //     icon: repaymentIcon,
    // },
    {
        id: "repayment",
        name: "Repayment Oversight",
        info: "View Payment Details",
        icon: repaymentIcon,
        children: [
            { id: "repayment", name: "Advance Repayment Oversight", path: "/home/repayment" },
            { id: "vafRepayment", name: "VAF Repayment Oversight", path: "/home/repayment/vafRepayment" },
        ]
    },
    {
        id: "notifications",
        name: "Notifications",
        path: "/home/notifications",
        info: "Notification Details",
        icon: notificationIcon,
    },
    // {
    //     id: "reports",
    //     name: "Reports & Analytics",
    //     path: "/home/reports",
    //     icon: reportIcon,
    // },
    {
        id: "reports",
        name: "Reports & Analytics",
        path: "/home/reports",
        icon: reportIcon,
        children: [
            {
                id: "advanceReports",
                name: "Advance Reports & Analytics",
                path: "/home/reports",
            },
            {
                id: "vafReports",
                name: "VAF Reports and Analytics",
                path: "/home/reports/vafReports",
            },
        ],
    },
    {
        id: "settings",
        name: "Settings",
        path: "/home/settings",
        icon: settingIcon,
        edit: "Edit Role"
    },
    {
        id: "rewards",
        name: "Reward Status",
        path: "/home/rewards",
        icon: rewardIcon,
        info: "Member Details",
    },

    {
        id: "ehailingReport",
        name: "eHailing Earnings Report View",
        path: "/home/ehailingReport",
        icon: ehailingReport,
        info: "eHailing Earnings Report View",
    },
    {
        id: "ehailingAdmin",
        name: "eHailing Earnings Report Admin",
        path: "/home/ehailingAdmin",
        icon: ehailingAdmin,
        info: "eHailing Earnings Report Admin",
    },
    {
        id: "logout",
        name: "Logout",
        path: "/logout",
        icon: logout,
    },
];


