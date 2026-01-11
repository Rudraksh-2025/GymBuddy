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

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",

        /* Glass effect */
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        border: "1px solid rgba(255,255,255,0.18)",

        boxShadow: `
          inset 0 0 0.5px rgba(255,255,255,0.6),
          0 8px 32px rgba(0,0,0,0.35)
        `,

        color: "white",
      }}
    >
      {/* subtle highlight layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.15), transparent 60%)",
          pointerEvents: "none",
        }}
      />

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
            {remaining}
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
