import { Box, Typography, CircularProgress } from "@mui/material";

const MacroRing = ({
    title,
    goal = 0,
    consumed = 0,
    unit = "",
    color = "#6366F1",
}) => {
    const remaining = Math.max(goal - consumed, 0);
    const progress = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

    return (
        <Box
            sx={{
                p: 2.5,
                borderRadius: "16px",
                bgcolor: "white",
                boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.08)",
                // height: "100%",
            }}
        >
            <Typography textAlign={'center'} fontWeight={600}>{title}</Typography>
            {/* <Typography variant="body2" color="text.secondary" mb={2}>
                Remaining = Goal − Consumed
            </Typography> */}

            <Box
                sx={{
                    position: "relative",
                    display: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={150}
                    thickness={4}
                    sx={{ color: "#E5E7EB" }}
                />

                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={150}
                    thickness={4}
                    sx={{
                        color,
                        position: "absolute",
                        left: 0,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        textAlign: "center",
                    }}
                >
                    <Typography fontSize="24px" fontWeight={700}>
                        {remaining}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Remaining {unit}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default MacroRing;
