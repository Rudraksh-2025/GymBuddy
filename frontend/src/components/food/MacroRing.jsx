import { Box, Typography, CircularProgress } from "@mui/material";

const MacroRing = ({
  title,
  goal = 0,
  consumed = 0,
  unit = "",
  color = "#8B5CF6",
}) => {
  const remaining = Math.max(goal - consumed, 0);
  const progress = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  const handleGlowMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };
  return (
    <Box
      className='glass-container'
      onMouseMove={handleGlowMove}
      sx={{
        p: 2.5,
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* subtle highlight layer */}
      <Box className='glass-layer' />

      <Typography textAlign="center" fontWeight={600} mb={1} zIndex={1}>
        {title}
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: 150,
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          zIndex: 1,
        }}
      >
        {/* track */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={150}
          thickness={4}
          sx={{
            color: "rgba(255,255,255,0.15)",
            position: "absolute",
          }}
        />

        {/* progress */}
        <CircularProgress
          variant="determinate"
          value={progress}
          size={150}
          thickness={4}
          sx={{
            position: "absolute",
            color,
            filter: "drop-shadow(0 0 5px rgba(139,92,246,0.6))",
          }}
        />

        {/* center glass pill */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: "14px",
            textAlign: "center",
          }}
        >
          <Typography fontSize="22px" fontWeight={700}>
            {remaining?.toFixed(0)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Remaining {unit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MacroRing;
