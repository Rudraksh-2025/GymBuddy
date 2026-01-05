import { Box, Typography, Tooltip } from "@mui/material";
import fire from '../assets/images/fire.webp'

const FireStreak = ({ streak = 0 }) => {
    if (streak === 0) return null;

    return (
        <Tooltip title="Daily activity streak">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    px: 1.2,
                    py: 0.4,
                    borderRadius: "16px",
                    bgcolor: "rgba(255, 87, 34, 0.15)",
                }}
            >
                <img src={fire} alt="" height='20' width='20' />

                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#FF5722",
                    }}
                >
                    {streak}
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default FireStreak;
