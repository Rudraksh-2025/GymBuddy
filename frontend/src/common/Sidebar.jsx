import { useEffect, useState } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Toolbar,
    Typography,
    useMediaQuery,
    Collapse,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { superadmin_menulist } from "./MenuList";
import logo4 from "../assets/images/logo.svg";
import { useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const drawerWidth = 260;

const Sidebar = ({ isActive, setActive, sidebarRef }) => {
    const [currentMenu, setCurrentMenu] = useState("home");
    const [openMenus, setOpenMenus] = useState({});
    const location = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // detect md & up

    useEffect(() => {
        const currentPath = location.pathname.split("/");
        setCurrentMenu(currentPath[2] ? currentPath[2] : currentPath[1]);
        if (location.pathname.startsWith("/reports")) {
            setOpenReports(true);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        nav("/");
    };
    const toggleMenu = (menuId) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    };


    const drawerContent = (
        <Box sx={{
            height: '100%',
        }}>
            {/* --- Logo --- */}
            <Toolbar sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Box component="img" src={logo4} alt="logo" sx={{ width: "70%" }} />
            </Toolbar>
            {/* --- Menu List --- */}
            <List sx={{
                height: '88vh', overflowY: 'auto', scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
            }}>
                {superadmin_menulist.map((menu) => {
                    const isOpen = openMenus[menu.id] || false;

                    // --- If menu has children -> COLLAPSIBLE ---
                    if (menu.children) {
                        return (
                            <Box key={menu.id}>
                                <ListItemButton
                                    selected={currentMenu === menu.id}
                                    onClick={() => toggleMenu(menu.id)}
                                    sx={{
                                        borderRadius: 2,
                                        mx: 1,
                                        mb: 1,
                                        "&.Mui-selected": {
                                            bgcolor: "#3EC2CD",
                                            boxShadow: "0px 8px 10px #3EC2CD4D",
                                            '&:hover': {
                                                bgcolor: "#3EC2CD"
                                            },
                                            "& .MuiTypography-root": { fontWeight: 600, color: "white" }
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        <Box sx={{ boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)", backgroundColor: 'white', borderRadius: '8px', p: 0.5, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Box component="img" src={menu.icon} sx={{ width: 22, height: 22 }} />
                                        </Box>
                                    </ListItemIcon>

                                    <ListItemText primary={<Typography sx={{ fontSize: '14px', fontWeight: 550 }}> {menu.name} </Typography>} />
                                    {isOpen ? (
                                        <ExpandLess sx={{ color: currentMenu === menu.id ? "white" : "inherit" }} />
                                    ) : (
                                        <ExpandMore sx={{ color: currentMenu === menu.id ? "white" : "inherit" }} />
                                    )}
                                </ListItemButton>

                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {menu.children.map((child) => (
                                            <ListItemButton
                                                key={child.id}
                                                selected={location.pathname === child.path}
                                                sx={{ ml: 6, borderRadius: 2, mr: 2 }}
                                                onClick={() => nav(child.path)}
                                            >
                                                <ListItemText primary={<Typography sx={{ fontSize: '14px', fontWeight: 550 }}>   {child.name} </Typography>} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        );
                    }

                    // --- REGULAR MENU WITHOUT CHILDREN ---
                    return (
                        <ListItemButton
                            key={menu.id}
                            selected={currentMenu === menu.id}
                            onClick={() => menu.id === "logout" ? handleLogout() : nav(menu.path)}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                mb: 1,
                                "&.Mui-selected": {
                                    bgcolor: "#3EC2CD",
                                    boxShadow: "0px 8px 10px #3EC2CD4D",
                                    '&:hover': {
                                        bgcolor: "#3EC2CD"
                                    },
                                    "& .MuiTypography-root": { fontWeight: 600, color: "white" }
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Box sx={{ boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)", backgroundColor: 'white', borderRadius: '8px', p: 0.5, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Box component="img" src={menu.icon} sx={{ width: 22, height: 22 }} />
                                </Box>
                            </ListItemIcon>

                            <ListItemText primary={<Typography sx={{ fontSize: '14px', fontWeight: 550 }}> {menu.name} </Typography>} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <>
            {/* Permanent Sidebar on md+ */}
            {isMdUp ? (
                <Drawer
                    variant="permanent"
                    open

                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            border: '0px',
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                // Temporary Drawer on xs/sm
                <Drawer
                    ref={sidebarRef}
                    variant="temporary"
                    open={isActive}
                    onClose={() => setActive(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            border: '0px',
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

export default Sidebar;
