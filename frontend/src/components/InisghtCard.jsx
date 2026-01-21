import { Box, Typography, Chip } from "@mui/material";

const priorityColor = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#22C55E",
};

const InsightCard = ({ title, message, priority }) => {
    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: "14px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                mb: 1.2,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={600} fontSize={14}>
                    {title}
                </Typography>

                <Chip
                    size="small"
                    label={priority}
                    sx={{
                        height: 20,
                        fontSize: 11,
                        bgcolor: priorityColor[priority],
                        color: "white",
                    }}
                />
            </Box>

            <Typography
                fontSize={13}
                mt={0.5}
                sx={{ opacity: 0.85, lineHeight: 1.4 }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default InsightCard;
