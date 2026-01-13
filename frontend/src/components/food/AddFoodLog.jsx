import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import CustomInput from "../../common/custom/CustomInput";
import CustomSelect from "../../common/custom/CustomSelect";
import { BootstrapInput } from "../../common/custom/BootsrapInput";
import { useCreateFoodLog } from "../../Api/Api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGetFoods } from "../../Api/Api";

const MEALS = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snacks", value: "snacks" },
];

const AddFoodLog = ({
  open,
  onClose,
  date,
  defaultMeal = "breakfast",
  onSubmit,
}) => {
  const queryClient = useQueryClient();
  const { data: foods } = useGetFoods();
  const { mutate } = useCreateFoodLog(
    () => {
      toast.success("Food Log added");
      queryClient.invalidateQueries({ queryKey: ["foodLogs"] });
      queryClient.invalidateQueries({ queryKey: ["foodSummary"] });
      onClose();
    },
    (err) => {
      toast.error(err?.response?.data?.message || "Failed to add food");
    }
  );
  const foodForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      foodId: "",
      quantity: 1,
      mealType: defaultMeal,
    },
    onSubmit: (values) => {
      const selectedFood = foods?.data?.find((f) => f._id === values.foodId);
      if (!selectedFood) {
        toast.error("Please select food");
        return;
      }

      const qty = Number(values.quantity);

      mutate({
        foodId: values.foodId,
        quantity: qty,
        mealType: values.mealType,
        date,
        calories: Number((selectedFood.calories * qty).toFixed(0)),
        protein: Number((selectedFood.protein * qty).toFixed(1)),
        carbs: Number((selectedFood.carbs * qty).toFixed(1)),
        fats: Number((selectedFood.fats * qty).toFixed(1)),
      });
    },
  });

  useEffect(() => {
    if (open) foodForm.resetForm();
  }, [open]);

  // ---------- DERIVED DATA ----------
  const selectedFood = useMemo(
    () => foods?.data?.find((f) => f._id === foodForm.values.foodId),
    [foods?.data, foodForm.values.foodId]
  );

  const qty = Number(foodForm.values.quantity || 0);

  const calories = selectedFood ? (selectedFood.calories * qty).toFixed(0) : 0;
  const protein = selectedFood ? (selectedFood.protein * qty).toFixed(1) : 0;
  const carbs = selectedFood ? (selectedFood.carbs * qty).toFixed(1) : 0;
  const fats = selectedFood ? (selectedFood.fats * qty).toFixed(1) : 0;

  const progress = Math.min((calories / 2000) * 100, 100);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.55)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "22px",
          position: "relative",
          overflow: "hidden",

          /* Glass paper */
          background: "rgba(30,30,40,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.18)",

          boxShadow: `
        inset 0 0 0.5px rgba(255,255,255,0.6),
        0 20px 60px rgba(0,0,0,0.6)
      `,
          color: "white",
        },
      }}
    >
      {/* glossy overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.15), transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* TITLE */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 600,
          position: "relative",
          zIndex: 1,
          background: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        Add Food
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        sx={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
          color: "white",
          mt: 2,
          p: { xs: 2, sm: 3 }
        }}
      >
        {/* FOOD */}
        <CustomSelect
          label="Food"
          name="foodId"
          value={foodForm.values.foodId}
          theme="dark"
          onChange={foodForm.handleChange}
          options={foods?.data?.map((f) => ({
            label: f.name,
            value: f._id,
          }))}
        />

        {/* Serving Size */}
        <Box mt={2}>
          <FormControl variant="standard" fullWidth>
            <InputLabel
              shrink
              htmlFor="servingSize"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 500,
                color: "white",
                "&.Mui-focused": { color: "white" },
              }}
            >
              Serving Size
            </InputLabel>

            <BootstrapInput
              id="servingSize"
              name="servingSize"
              placeholder="Serving Size"
              value={selectedFood?.servingSize}
              readOnly
              sx={{
                color: "white",
                backdropFilter: "blur(6px)",
                borderRadius: "10px",
              }}
            />
          </FormControl>
        </Box>

        {/* Quantity */}
        <Box mt={2}>
          <CustomInput
            label="Number of Servings"
            name="quantity"
            type="number"
            formik={foodForm}
            inputProps={{ min: 0.25, step: 0.25 }}
          />
        </Box>

        {/* Meal */}
        <Box mt={2}>
          <CustomSelect
            label="Meal"
            name="mealType"
            theme="dark"
            value={foodForm.values.mealType}
            onChange={foodForm.handleChange}
            options={MEALS}
          />
        </Box>

        {/* MACRO PREVIEW — GLASS PANEL */}
        <Box
          mt={4}
          px={2}
          py={1.5}
          borderRadius="16px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `
          inset 0 0 6px rgba(255,255,255,0.25),
          0 6px 18px rgba(0,0,0,0.4)
        `,
          }}
        >
          {/* RING */}
          <Box sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={90}
              sx={{ color: "rgba(255,255,255,0.25)" }}
            />
            <CircularProgress
              variant="determinate"
              value={progress}
              size={90}
              sx={{
                color: "#22C55E",
                position: "absolute",
                // left: 0,
                filter: "drop-shadow(0 0 6px rgba(34,197,94,0.7))",
              }}
            />

            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Typography fontWeight={700}>{calories}</Typography>
              <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                cal
              </Typography>
            </Box>
          </Box>

          {/* MACROS */}
          {[
            { label: "Carbs", value: carbs },
            { label: "Fat", value: fats },
            { label: "Protein", value: protein },
          ].map((m) => (
            <Box key={m.label} textAlign="center">
              <Typography fontWeight={600}>{m.value} g</Typography>
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>
                {m.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          position: "relative",
          zIndex: 1,
          background: "transparent",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            borderRadius: "10px",
            px: 2.5,
            background: "rgba(255,255,255,0.08)",
            "&:hover": { background: "rgba(255,255,255,0.15)" },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={foodForm.handleSubmit}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 14px rgba(139,92,246,0.8)",
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFoodLog;
