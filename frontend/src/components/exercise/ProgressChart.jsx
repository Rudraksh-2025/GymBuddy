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

    // Extract x-axis (dates) + y-axis series
    const labels = progress?.map((p) => p._id.date) || [];
    const avgWeight = progress?.map((p) => p.avgWeight) || [];
    const avgReps = progress?.map((p) => p.avgReps) || [];
    const totalVolume = progress?.map((p) => p.totalVolume) || [];
    const maxWeight = progress?.map((p) => p.maxWeight) || [];

    const toggleVisibility = (label) => {
        setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const visibleSeries = [
        { data: avgWeight, label: "Avg Weight", color: theme.palette.primary.main, id: "AvgWeight" },
        { data: avgReps, label: "Avg Reps", color: theme.palette.secondary.main, id: "AvgReps" },
        { data: totalVolume, label: "Total Volume", color: theme.palette.success.main, id: "TotalVolume" },
        { data: maxWeight, label: "Max Weight", color: theme.palette.error.main, id: "MaxWeight" },
    ].map((s) => ({ ...s, visible: visibility[s.label] }));

    const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

    return (
        <>
            <LineChart
                hideLegend
                grid={{ horizontal: true }}
                xAxis={[
                    { scaleType: "point", data: labels, disableLine: true, tickLabelStyle: axisFontStyle }
                ]}
                yAxis={[
                    { disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }
                ]}
                height={400}
                series={visibleSeries.filter((s) => s.visible).map((s) => ({
                    type: "line",
                    data: s.data,
                    label: s.label,
                    area: true,
                    id: s.id,
                    color: s.color,
                    stroke: s.color,
                    strokeWidth: 2
                }))}
            />
            <Legend items={visibleSeries} onToggle={toggleVisibility} />
        </>
    );
}

ExerciseProgressChart.propTypes = {
    progress: PropTypes.array,
};
