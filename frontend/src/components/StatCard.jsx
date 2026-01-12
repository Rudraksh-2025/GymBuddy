import { Card, Stack, Box, Typography } from "@mui/material";

const StatCard = ({ title, value, sub, icon, color }) => (
  <Card
    className="glass-container"
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty(
        "--x",
        `${e.clientX - rect.left}px`
      );
      e.currentTarget.style.setProperty(
        "--y",
        `${e.clientY - rect.top}px`
      );
    }}
    sx={{
      p: 2,
      borderRadius: "18px",
      position: "relative",
      overflow: "hidden",
      color: "white",
    }}
  >
    {/* glossy highlight */}
    <Box
      className='glass-layer'
    />

    <Stack direction="row" justifyContent="space-between" alignItems="center" zIndex={1}>
      <Box>
        <Typography fontSize={13} sx={{ opacity: 0.75 }}>
          {title}
        </Typography>

        <Typography fontSize={22} fontWeight={700}>
          {value}
        </Typography>

        {sub && (
          <Typography fontSize={12} sx={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}>
            {sub}
          </Typography>
        )}
      </Box>

      {/* icon glass badge */}
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.25)",

          boxShadow: `
            inset 0 0 6px rgba(255,255,255,0.25),
            0 4px 12px rgba(0,0,0,0.4)
          `,
          color: color || "white",
        }}
      >
        {icon}
      </Box>
    </Stack>
  </Card>
);

export default StatCard;
