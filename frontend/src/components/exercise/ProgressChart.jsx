import { alpha, useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Stack } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

function Legend({ items, onToggle }) {
    return (
        <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "center", mt: 2.5, mb: 1.5 }}>
            {items.map((item) => (
                <Stack
                    key={item.label}
                    direction="row"
                    sx={{ gap: 1.25, alignItems: "center", cursor: "pointer" }}
                    onClick={() => onToggle(item.label)}
                >
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            bgcolor: item.visible ? item.color : "grey.500",
                            borderRadius: "50%",
                        }}
                    />
                    <Typography variant="body2" color="text.primary">
                        {item.label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    );
}

export default function ExerciseProgressChart({ progress }) {
    const theme = useTheme();
    const [visibility, setVisibility] = useState({
        "Avg Weight": true,
        "Avg Reps": true,
        "Total Volume": true,
        "Max Weight": true,
    });

    const labels = progress?.map((p) => p._id.date) || [];
    const avgWeight = progress?.map((p) => p.avgWeight) || [];
    const avgReps = progress?.map((p) => p.avgReps) || [];
    const totalVolume = progress?.map((p) => p.totalVolume) || [];
    const maxWeight = progress?.map((p) => p.maxWeight) || [];

    const toggleVisibility = (label) => {
        setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const visibleSeries = [
        {
            data: avgWeight,
            label: "Avg Weight",
            color: "#4FD1C5",
            id: "AvgWeight",
        },
        {
            data: avgReps,
            label: "Avg Reps",
            color: "#9F7AEA",
            id: "AvgReps",
        },
        {
            data: totalVolume,
            label: "Total Volume",
            color: "#48BB78",
            id: "TotalVolume",
        },
        {
            data: maxWeight,
            label: "Max Weight",
            color: "#F56565",
            id: "MaxWeight",
        },
    ].map((s) => ({ ...s, visible: visibility[s.label] }));

    return (
        <Box
            sx={{
                bgcolor: "white", // ✅ dark background
                borderRadius: 3,
                p: 2,
            }}
        >
            <LineChart
                height={400}
                hideLegend
                grid={{ horizontal: true }}
                xAxis={[
                    {
                        scaleType: "point",
                        data: labels,
                        disableLine: true,
                        tickLabelStyle: {
                            fill: "#9CA3AF",
                            fontSize: 11,
                        },
                    },
                ]}
                yAxis={[
                    {
                        disableLine: true,
                        disableTicks: true,
                        tickLabelStyle: {
                            fill: "#9CA3AF",
                            fontSize: 11,
                        },
                    },
                ]}
                sx={{
                    "& .MuiChartsGrid-line": {
                        stroke: "rgba(255,255,255,0.08)", // subtle grid
                    },
                    "& .MuiChartsAxis-tickLabel": {
                        fill: "#9CA3AF",
                    },
                    "& .MuiChartsTooltip-root": {
                        backgroundColor: "#1F2937",
                        color: "white",
                        borderRadius: "8px",
                    },
                }}
                series={visibleSeries
                    .filter((s) => s.visible)
                    .map((s) => ({
                        type: "line",
                        data: s.data,
                        label: s.label,
                        id: s.id,
                        curve: "monotoneX",
                        color: s.color,
                        stroke: s.color,
                        strokeWidth: 2,
                        area: true,
                        showMark: true,
                        areaOpacity: 0.25, // ✅ soft glow
                    }))}
            />

            {/* Legend */}
            <Legend
                items={visibleSeries.map((i) => ({
                    ...i,
                    visible: visibility[i.label],
                }))}
                onToggle={toggleVisibility}
            />
        </Box>
    );
}


ExerciseProgressChart.propTypes = {
    progress: PropTypes.array,
};