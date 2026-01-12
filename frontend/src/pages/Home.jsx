import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../components/StatCard";

const Home = () => {
  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      {/* =================== TOP STATS =================== */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Calories Today"
            value="1680 / 2200"
            sub="520 kcal left"
            icon={<RestaurantIcon />}
            color="#6366F1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Current Weight"
            value="72.4 kg"
            sub="-1.2 kg this month"
            icon={<MonitorWeightIcon />}
            color="#22C55E"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Workouts"
            value="4 this week"
            sub="Upper / Cardio"
            icon={<FitnessCenterIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Streak"
            value="6 days"
            sub="Keep going"
            icon={<WhatshotIcon />}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* =================== MID SECTION =================== */}
      <Grid container spacing={3} mt={5}>
        {/* CALORIE PROGRESS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 2,
              height: "100%",
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden", color: "white",
            }}
            className='glass-container'
          >
            {/* highlight */}
            <Box
              className='glass-layer'
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Calorie Progress
              </Typography>

              <Typography fontSize={13} sx={{ opacity: 0.7 }}>
                1680 kcal consumed
              </Typography>

              <LinearProgress
                variant="determinate"
                value={76}
                sx={{
                  mt: 2,
                  height: 10,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.15)",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #22D3EE, #8B5CF6)",
                    boxShadow: "0 0 10px rgba(139,92,246,0.7)",
                  },
                }}
              />

              <Typography mt={1} fontSize={13} sx={{ opacity: 0.7 }}>
                520 kcal remaining
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* WEIGHT TREND */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 2,
              height: "100%",
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              color: "white",
            }}
            className='glass-container'
          >
            <Box
              className='glass-layer'
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Weekly Weight Trend
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  height: 120,
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.7,
                }}
              >
                Chart Coming Soon
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* =================== BOTTOM SECTION =================== */}
      <Grid container spacing={3} mt={10}>
        {/* RECENT MEALS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              color: "white",
            }}
            className='glass-container'
          >
            <Box
              className='glass-layer'
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>Recent Meals</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ color: "#8B5CF6" }}
                >
                  Add
                </Button>
              </Stack>

              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.15)" }} />

              {["Oats & Milk", "Chicken & Rice", "Protein Shake"].map(
                (m, i) => (
                  <Typography
                    key={i}
                    fontSize={14}
                    mb={0.8}
                    sx={{ opacity: 0.85 }}
                  >
                    • {m}
                  </Typography>
                )
              )}
            </Box>
          </Box>
        </Grid>

        {/* RECENT WORKOUTS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              color: 'white'
            }}
            className='glass-container'
          >
            <Box
              className='glass-layer'
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>Recent Workouts</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ color: "#8B5CF6" }}
                >
                  Log
                </Button>
              </Stack>

              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.15)" }} />

              {["Chest + Triceps", "Back + Biceps", "Leg Day"].map((w, i) => (
                <Typography
                  key={i}
                  fontSize={14}
                  mb={0.8}
                  sx={{ opacity: 0.85 }}
                >
                  • {w}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
