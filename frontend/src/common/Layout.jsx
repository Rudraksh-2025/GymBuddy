import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetProfile } from "../Api/Api";


const drawerWidth = 240;

function Layout() {
    const [isActive, setActive] = useState(false);
    const sidebarRef = useRef();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const { refetch, data: profile } = useGetProfile({
        enabled: false, // prevent auto fetch
    });

    useEffect(() => {
        refetch(); // runs once on mount
    }, [refetch]);

    // Close sidebar when clicking outside (on small screens)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                window.innerWidth < 992 &&
                isActive &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isActive]);


    return (
        <div style={{ display: "flex" }}>
            {/* Sidebar */}
            <Sidebar
                setActive={setActive}
                isActive={isActive}
                sidebarRef={sidebarRef}
            />

            {/* Main Content */}
            <div
                style={{
                    flexGrow: 1,
                    width: isMdUp ? `calc(100% - ${drawerWidth}px)` : "100%",
                }}
            >
                <Navbar streak={profile?.data?.streak} setActive={setActive} isActive={isActive} />
                <Toolbar /> {/* Push content below AppBar height */}
                <div style={{ padding: "20px", overflowX: 'hidden', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
