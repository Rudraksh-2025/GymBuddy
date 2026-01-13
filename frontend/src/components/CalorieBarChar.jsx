import React, { useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/* ---------------- MOCK DATA (replace with API later) ---------------- */

const weeklyData = [
    { name: "Mon", calories: 1800 },
    { name: "Tue", calories: 2100 },
    { name: "Wed", calories: 1950 },
    { name: "Thu", calories: 2200 },
    { name: "Fri", calories: 2000 },
    { name: "Sat", calories: 2600 },
    { name: "Sun", calories: 2300 },
];

const monthlyData = [
    { name: "Week 1", calories: 13500 },
    { name: "Week 2", calories: 14200 },
    { name: "Week 3", calories: 15000 },
    { name: "Week 4", calories: 14600 },
];

const yearlyData = [
    { name: "Jan", calories: 62000 },
    { name: "Feb", calories: 58000 },
    { name: "Mar", calories: 64000 },
    { name: "Apr", calories: 60000 },
    { name: "May", calories: 67000 },
    { name: "Jun", calories: 69000 },
    { name: "Jul", calories: 72000 },
    { name: "Aug", calories: 71000 },
    { name: "Sep", calories: 68000 },
    { name: "Oct", calories: 66000 },
    { name: "Nov", calories: 64000 },
    { name: "Dec", calories: 70000 },
];

/* -------------------------------------------------------------------- */

const CaloriesBarChart = () => {
    const [tab, setTab] = useState(0);

    const getData = () => {
        if (tab === 0) return weeklyData;
        if (tab === 1) return monthlyData;
        return yearlyData;
    };
    const handleGlowMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "20px",
                color: "white",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseMove={handleGlowMove}
            className="glass-container"
        >
            <Box className="glass-layer" />

            <Box sx={{ position: "relative", zIndex: 1 }}>
                {/* HEADER */}
                <Typography fontWeight={600} mb={1}>
                    Calorie Intake Overview
                </Typography>

                {/* TABS */}
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{
                        mb: 1,
                        // indicator color
                        "& .MuiTabs-indicator": {
                            backgroundColor: "rgba(139,92,246,0.7)",
                            height: 3,
                            borderRadius: 2,
                        },
                        // all tab text white
                        "& .MuiTab-root": {
                            color: "#FFFFFF",
                            fontSize: 13,
                            minHeight: 30,
                            textTransform: "none",
                            opacity: 0.7,
                        },

                        // selected tab text
                        "& .MuiTab-root.Mui-selected": {
                            color: "#FFFFFF",
                            opacity: 1,
                        },
                    }}
                >
                    <Tab label="Weekly" />
                    <Tab label="Monthly" />
                    <Tab label="Yearly" />
                </Tabs>

                {/* CHART */}
                <Box sx={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getData()}>
                            <XAxis dataKey="name" stroke="#E5E7EB" />
                            {/* <YAxis stroke="#E5E7EB" /> */}
                            <Tooltip
                                contentStyle={{
                                    background: "#111827",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: 8,
                                    color: "white",
                                }}
                            />
                            <Bar
                                dataKey="calories"
                                radius={[6, 6, 0, 0]}
                                fill="url(#colorUv)"
                            />
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22D3EE" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default CaloriesBarChart;
