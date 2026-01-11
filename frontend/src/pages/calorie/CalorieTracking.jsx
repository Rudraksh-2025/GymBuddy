import React, { useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import {
  useGetCalorieSummary,
  useGetFoodLog,
  useDeleteFoodLog,
} from "../../Api/Api";
import AddFoodLog from "../../components/food/AddFoodLog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import MacroRing from "../../components/food/MacroRing";
import MealSection from "../../components/food/MealSection";
import CustomDatePicker from "../../common/custom/CustomDatePicker";
import EditGoalDialog from "../../components/food/EditGoalDialog";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import StatCard from "../../components/StatCard";

const CalorieTracking = () => {
  const [openAddFood, setOpenAddFood] = useState();
  const [selectedMeal, setSelectedMeal] = useState();
  const [date, setDate] = useState(new Date());
  const [openEdit, setOpenEdit] = useState(false);
  const client = useQueryClient();

  const { data: analytics } = useGetCalorieSummary(date);
  const { data: foodLog } = useGetFoodLog(date);
  const { mutate: deleteFoodLog } = useDeleteFoodLog(
    () => {
      toast.success("Food Log Deleted successfully");
      client.invalidateQueries({ queryKey: ["foodLogs"] });
      client.invalidateQueries({ queryKey: ["foodSummary"] });
    },
    (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete Food Log");
    }
  );
  const handleDelete = (id) => {
    deleteFoodLog(id);
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      {/* ---------------- ANALYTICS BOX ---------------- */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CustomDatePicker value={date} onChange={setDate} />
        <Button className="glass-btn" onClick={() => setOpenEdit(true)}>
          Edit Goals
        </Button>
      </Box>
      
        <Grid container spacing={3} my={5}>
          {/* Weekly Avg Calories */}
          <Grid size={{ xs: 12, sm: 6,lg:4 }}>
            <StatCard
              title="Weekly Avg Calories"
              value={`${analytics?.data?.weekly?.averageCalories ?? 0} kcal`}
              sub="Last 7 days"
              icon={<LocalFireDepartmentIcon sx={{ color: "white" }} />}
              color="#16A34A"
            />
          </Grid>

          {/* TDEE */}
    <Grid size={{ xs: 12, sm: 6,lg:4 }}>
            <StatCard
              title="TDEE"
              value={`${analytics?.data?.tdee ?? 0} kcal`}
              sub="Daily energy burn"
              icon={<TrendingUpIcon sx={{ color: "white" }} />}
              color="#F59E0B"
            />
          </Grid>

          {/* BMR */}
         <Grid size={{ xs: 12, sm: 6,lg:4 }}>
            <StatCard
              title="BMR"
              value={`${analytics?.data?.bmr ?? 0} kcal`}
              sub="Resting burn"
              icon={<MonitorHeartIcon sx={{ color: "white" }} />}
              color="#EF4444"
            />
          </Grid>
        </Grid>
    
      <Grid container spacing={3} my={5} >
        <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
          <MacroRing
            title="Calories"
            goal={analytics?.data?.today?.goal?.calories}
            consumed={analytics?.data?.today?.consumed?.calories}
            unit="kcal"
            color="#6366F1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
          <MacroRing
            title="Protein"
            goal={analytics?.data?.today?.goal?.protein}
            consumed={analytics?.data?.today?.consumed?.protein}
            unit="g"
            color="#22C55E"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
          <MacroRing
            title="Carbs"
            goal={analytics?.data?.today?.goal?.carbs}
            consumed={analytics?.data?.today?.consumed?.carbs}
            unit="g"
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
          <MacroRing
            title="Fats"
            goal={analytics?.data?.today?.goal?.fats}
            consumed={analytics?.data?.today?.consumed?.fats}
            unit="g"
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* ----------- MEAL SECTIONS ----------- */}
      <Box sx={{ mt: 4 }}>
        <MealSection
          title="Breakfast"
          onAddFood={() => {
            setSelectedMeal("breakfast");
            setOpenAddFood(true);
          }}
          data={foodLog?.data?.breakfast}
          onDeleteFood={handleDelete}
        />

        <MealSection
          title="Lunch"
          onAddFood={() => {
            setSelectedMeal("lunch");
            setOpenAddFood(true);
          }}
          onDeleteFood={handleDelete}
          data={foodLog?.data?.lunch}
        />

        <MealSection
          title="Dinner"
          onAddFood={() => {
            setSelectedMeal("dinner");
            setOpenAddFood(true);
          }}
          onDeleteFood={handleDelete}
          data={foodLog?.data?.dinner}
        />

        <MealSection
          title="Snacks"
          onAddFood={() => {
            setSelectedMeal("snacks");
            setOpenAddFood(true);
          }}
          onDeleteFood={handleDelete}
          data={foodLog?.data?.snacks}
        />
      </Box>

      <AddFoodLog
        open={openAddFood}
        onClose={() => setOpenAddFood(false)}
        date={date}
        defaultMeal={selectedMeal}
        onSubmit={() => console.log("food created")}
      />
      <EditGoalDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={analytics?.data?.today?.goal}
      />
    </Box>
  );
};

export default CalorieTracking;
