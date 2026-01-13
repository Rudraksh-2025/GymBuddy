import React from "react";
import { Box, Typography, Grid, Divider, Button, LinearProgress, Stack } from "@mui/material";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import AddIcon from "@mui/icons-material/Add";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CaloriesBarChart from "../components/CalorieBarChar";


import StatCard from "../components/StatCard";

const MacroBar = ({ label, value, goal, color }) => {
  const percent = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <Box mb={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={13}>{label}</Typography>
        <Typography fontSize={13}>
          {value}/{goal}g
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 6,
          background: "rgba(255,255,255,0.15)",
          "& .MuiLinearProgress-bar": {
            background: color,
            boxShadow: `0 0 8px ${color}`,
          },
        }}
      />
    </Box>
  );
};

const Home = () => {
  const handleGlowMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };
  const PercentageChange = ({ flag, value }) => {
    const isUp = flag === 'up';
    return (
      <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: isUp ? '#16A34A' : 'red', fontWeight: 500 }}>
        {isUp ? (
          <ArrowUpward sx={{ color: '#16A34A', fontSize: 18, mr: 0.3 }} />
        ) : (
          <ArrowDownward sx={{ color: 'red', fontSize: 18, mr: 0.3 }} />
        )}

        <Typography variant="body2" sx={{ color: isUp ? '#16A34A' : 'red' }}>{value || 0}%</Typography>
        <Typography variant="body2" sx={{ color: '#878787' }}>&nbsp;vs last week</Typography>
      </Box>
    );
  };
  /* 🔧 Replace with API later */
  const dashboard = {
    calories: { consumed: 1680, goal: 2200 },
    weight: 72.4,
    workouts: 4,
    streak: 6,
    weeklyAvgCalories: 1845,
    protein: { consumed: 110, goal: 150 },
    carbs: { consumed: 180, goal: 250 },
    fats: { consumed: 52, goal: 70 },
    meals: ["Oats & Milk", "Chicken & Rice", "Protein Shake"],
    workoutsRecent: ["Chest + Triceps", "Back + Biceps", "Leg Day"],
  };

  const caloriePercent =
    (dashboard.calories.consumed / dashboard.calories.goal) * 100;

  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      {/* =================== TOP STATS =================== */}
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Current Weight"
            value={`${dashboard.weight} kg`}
            sub="-1.2 kg this month"
            icon={<MonitorWeightIcon />}
            color="#22C55E"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Body Fat"
            value="19.8%"
            sub="-0.6% this month"
            icon={<TrendingDownIcon />}
            color="#06B6D4"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Calories Burned"
            value="420 kcal"
            sub="This week"
            icon={<LocalFireDepartmentIcon />}
            color="#F97316"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Weekly Avg Calories"
            value="420 kcal"
            sub="Last 7 days"
            icon={<LocalFireDepartmentIcon />}
            color="#F59E0B"

          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Total Weight Lost"
            value={`3 kg`}
            sub={
              <PercentageChange
                flag={'up'}
                value={20}
              />
            }
            icon={<TrendingDownIcon />}
            color="#EF4444"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Steps Today"
            value="8,420"
            sub={
              <PercentageChange
                flag="up"
                value={12}
              />
            }
            icon={<DirectionsWalkIcon />}
            color="#22C55E"
          />

        </Grid>

      </Grid>

      {/* =================== MID ANALYTICS =================== */}
      <Grid container spacing={3} sx={{ mt: { xs: 3, sm: 4 } }}>
        {/* CALORIE PROGRESS */}
        <Grid size={{ xs: 12, md: 6 }} sx={{
          p: 2,
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          color: "white",
        }} className="glass-container"
          onMouseMove={handleGlowMove}>
          <Box className="glass-layer" />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography fontWeight={600}>Calorie Progress</Typography>

            <Typography fontSize={13} sx={{ opacity: 0.7, mt: 2 }}>
              {dashboard.calories.consumed} kcal consumed
            </Typography>

            <LinearProgress
              variant="determinate"
              value={caloriePercent}
              sx={{
                mt: 2,
                height: 10,
                borderRadius: 6,
                background: "rgba(255,255,255,0.15)",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #22D3EE, #8B5CF6)",
                  boxShadow: "0 0 10px rgba(139,92,246,0.7)",
                },
              }}
            />

            <Typography mt={1} fontSize={13} sx={{ opacity: 0.7 }}>
              {dashboard.calories.goal - dashboard.calories.consumed} kcal
              remaining
            </Typography>
          </Box>
        </Grid>

        {/* MACRO PROGRESS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            className="glass-container"
            onMouseMove={handleGlowMove}
            sx={{
              p: 2,
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              color: "white",
            }}
          >
            <Box className="glass-layer" />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Macro Intake
              </Typography>

              <MacroBar
                label="Protein"
                value={dashboard.protein.consumed}
                goal={dashboard.protein.goal}
                color="#22C55E"
              />

              <MacroBar
                label="Carbs"
                value={dashboard.carbs.consumed}
                goal={dashboard.carbs.goal}
                color="#F59E0B"
              />

              <MacroBar
                label="Fats"
                value={dashboard.fats.consumed}
                goal={dashboard.fats.goal}
                color="#EF4444"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* =================== BOTTOM =================== */}
      <Grid container spacing={3} sx={{ mt: { xs: 6, sm: 5 } }}>
        {/* RECENT MEALS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            className="glass-container"
            onMouseMove={handleGlowMove}
            sx={{
              p: 2,
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              color: "white",
            }}
          >
            <Box className="glass-layer" />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>Recent Meals</Typography>
                <Button size="small" startIcon={<AddIcon />} sx={{ color: "#8B5CF6" }}>
                  Add
                </Button>
              </Stack>

              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.15)" }} />

              {dashboard.meals.map((m, i) => (
                <Typography key={i} fontSize={14} mb={0.8} sx={{ opacity: 0.85 }}>
                  • {m}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* RECENT WORKOUTS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            className="glass-container"
            onMouseMove={handleGlowMove}
            sx={{
              p: 2,
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              color: "white",
            }}
          >
            <Box className="glass-layer" />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>Recent Workouts</Typography>
                <Button size="small" startIcon={<AddIcon />} sx={{ color: "#8B5CF6" }}>
                  Log
                </Button>
              </Stack>

              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.15)" }} />

              {dashboard.workoutsRecent.map((w, i) => (
                <Typography key={i} fontSize={14} mb={0.8} sx={{ opacity: 0.85 }}>
                  • {w}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12 }}>
          <CaloriesBarChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
