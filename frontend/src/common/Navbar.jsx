import {
    Avatar,
    Box,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
} from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { menuList } from "./MenuList";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import FireStreak from "../components/FireStreak";



const Navbar = ({ setActive, isActive, streak, profilePhoto }) => {
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [isSubMenu, setIsSubMenu] = useState(false);

    const location = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    useEffect(() => {
        const pathParts = location.pathname.split("/").filter(Boolean);
        const fullPath = location.pathname;

        // Detect parent ID
        const parentId = pathParts[1];
        const parentMenu = menuList.find(menu => menu.id === parentId);

        // Detect Submenu Page (from collapsible menus)
        const isSubmenuPage =
            parentMenu?.children?.some(child => child.path === fullPath);

        // Detect Information / View / Edit pages
        const infoSegment = pathParts.find(part =>
            part.endsWith("-information") ||
            part.endsWith("-view") ||
            part.endsWith("-edit")
        );

        const isInfoPage = Boolean(infoSegment);

        // ----------------------------
        // CASE 1 → INFORMATION/EDIT PAGE (SHOW ARROW)
        // ----------------------------
        if (isInfoPage) {
            setIsSubMenu(true); // show back arrow

            let subTitle = "";

            if (infoSegment?.endsWith("-information"))
                subTitle = parentMenu?.info || "Information";
            else if (infoSegment?.endsWith("-view"))
                subTitle = parentMenu?.view || "View";
            else if (infoSegment?.endsWith("-edit"))
                subTitle = parentMenu?.edit || "Edit";

            setIsSubMenu(true);
            setPageTitle(subTitle);
            return;
        }

        // ----------------------------
        // CASE 2 → SUBMENU CHILD PAGE (NO ARROW)
        // ----------------------------
        if (isSubmenuPage) {
            setIsSubMenu(false); // hide back arrow

            const childItem = parentMenu.children.find(c => c.path === fullPath);
            setPageTitle(childItem?.name || "Page");
            return;
        }

        // ----------------------------
        // CASE 3 → PARENT PAGE
        // ----------------------------
        setIsSubMenu(false); // No arrow
        if (parentMenu) {
            setPageTitle(parentMenu.name);
        } else {
            setPageTitle("Dasboard");
        }
    }, [location]);




    return (
        <AppBar
            position="fixed"
            sx={{
                // zIndex: (theme) => theme.zIndex.drawer + 1,
                ...(isMdUp && {
                    width: `calc(100% - ${260}px)`,
                    ml: `${260}px`,
                }),
                bgcolor: "#1F2022",
                color: "white",
                boxShadow: "none",
            }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {isSubMenu ? (
                    <IconButton onClick={() => nav(-1)} sx={{ mr: 2, color: 'white' }}>
                        <IoArrowBack size={24} />
                    </IconButton>
                ) : (
                    !isMdUp && ( // Show hamburger only on xs/sm
                        <IconButton sx={{ mr: 2, color: 'white' }} onClick={() => setActive(true)}>
                            <MenuIcon size={24} />
                        </IconButton>
                    )
                )}
                <Typography
                    variant="h5"
                    fontWeight={600}
                    // className="mb-0"
                    sx={{ flexGrow: 1, fontSize: { xs: '18px', sm: "24px" } }}
                >
                    {pageTitle}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, pr: 0 }}>
                    <FireStreak streak={streak} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, pr: 0, cursor: 'pointer' }} onClick={() => nav('/home/profile')}>
                        <Avatar
                            alt="User"
                            src={profilePhoto || undefined}
                            sx={{ width: 35, height: 35 }}
                        >
                            <PersonIcon />
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;