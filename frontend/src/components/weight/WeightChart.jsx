import React, { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FormateDate } from "../../utils/FormateDate";

const WeightChart = ({ data = [] }) => {
  const chartData = useMemo(() => [...data].reverse(), [data]);

  return (
    <Box
      sx={{
        py: 3,
        px: { xs: 1.5, sm: 3 },
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",

        /* Glass surface */
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.18)",

        boxShadow: `
          inset 0 0 0.5px rgba(255,255,255,0.6),
          0 10px 34px rgba(0,0,0,0.4)
        `,
        color: "white",
      }}
    >
      {/* glossy highlight */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Typography
        fontSize="18px"
        fontWeight={600}
        mb={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        Weight Change
      </Typography>

      <Box sx={{ height: 400, position: "relative", zIndex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 40, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.12)"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) => FormateDate(value)}
              interval="preserveStartEnd"
              tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 1", "dataMax + 1"]}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(20,20,30,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "white",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#8B5CF6",
                stroke: "white",
                strokeWidth: 1,
              }}
              activeDot={{
                r: 6,
                fill: "#A78BFA",
                stroke: "white",
                strokeWidth: 1,
              }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(139,92,246,0.7))",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WeightChart;
