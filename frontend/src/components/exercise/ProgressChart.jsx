import { alpha, useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Stack } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

function Legend({ items, onToggle }) {
  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        mt: 2,
        flexWrap: "wrap",
      }}
    >
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{
            gap: 1.25,
            alignItems: "center",
            cursor: "pointer",
            px: 1.5,
            py: 0.75,
            borderRadius: "999px",

            background: item.visible
              ? "rgba(255,255,255,0.15)"
              : "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",

            "&:hover": {
              background: "rgba(255,255,255,0.22)",
            },
          }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              bgcolor: item.visible ? item.color : "grey.500",
              borderRadius: "50%",
              boxShadow: item.visible
                ? `0 0 8px ${item.color}`
                : "none",
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "white", fontWeight: 500 }}
          >
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
        // "Total Volume": true,
        "Max Weight": true,
    });

    const labels = progress?.map((p) => p._id.date) || [];
    const avgWeight = progress?.map((p) => p.avgWeight) || [];
    const avgReps = progress?.map((p) => p.avgReps) || [];
    // const totalVolume = progress?.map((p) => p.totalVolume) || [];
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
        // {
        //     data: totalVolume,
        //     label: "Total Volume",
        //     color: "#48BB78",
        //     id: "TotalVolume",
        // },
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
    borderRadius: "20px",
    p: 2.5,

    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.18)",

    boxShadow: `
      inset 0 0 0.5px rgba(255,255,255,0.6),
      0 12px 40px rgba(0,0,0,0.45)
    `,
  }}
>
  <LineChart
    height={380}
    hideLegend
    grid={{ horizontal: true }}
    xAxis={[
      {
        scaleType: "point",
        data: labels,
        disableLine: true,
        tickLabelStyle: {
          fill: "rgba(255,255,255,0.65)",
          fontSize: 11,
        },
      },
    ]}
    yAxis={[
      {
        disableLine: true,
        disableTicks: true,
        tickLabelStyle: {
          fill: "rgba(255,255,255,0.65)",
          fontSize: 11,
        },
      },
    ]}
    sx={{
      "& .MuiChartsGrid-line": {
        stroke: "rgba(255,255,255,0.08)",
      },

      "& .MuiChartsAxis-tickLabel": {
        fill: "rgba(255,255,255,0.65)",
      },

      /* tooltip glass */
      "& .MuiChartsTooltip-root": {
        background: "rgba(30,30,40,0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "10px",
        color: "white",
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
        strokeWidth: 2.5,
        showMark: true,
        area: true,
        areaOpacity: 0.18,

        /* glow effect */
        highlightScope: { highlighted: "series", faded: "none" },
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