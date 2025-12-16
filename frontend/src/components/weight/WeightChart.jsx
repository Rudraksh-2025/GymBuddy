import React from 'react'
import { Typography, Card, Box } from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer, Label
} from "recharts";

const WeightChart = ({ data }) => {
    return (
        <Box
            sx={{
                py: 3,
                px: { xs: 1, sm: 3 },
                boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)",
                borderRadius: 3,
                bgcolor: "white",
            }}
        >
            <Typography fontSize="18px" fontWeight={600} mb={1}>
                Weight Change
            </Typography>
            <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="99%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 40, right: 10, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" interval="preserveStartEnd" tick={{ fontSize: 12 }} tickLine={false} />
                        <YAxis axisLine={false} interval="preserveStartEnd" tickLine={false} domain={["dataMin - 1", "dataMax + 1"]}>
                            {/* <Label
                                value="weight"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: "middle" }}
                            /> */}
                        </YAxis>
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#00DCE2"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#00DCE2" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}

export default WeightChart
