import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box } from "@mui/material";
import { foodValidation } from "../../common/FormValidation";
import CustomInput from "../../common/custom/CustomInput";
import { useFormik } from "formik";
import { useCreateFood, useUpdateFood } from "../../Api/Api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AddFoodDialog = ({ open, onClose, selectedFood, setSelectedFood }) => {
  const client = useQueryClient()
  const isEditMode = Boolean(selectedFood?._id);
  const foodForm = useFormik({
    initialValues: foodValues,
    validationSchema: foodValidation,

    onSubmit: (values) => {
      if (isEditMode) {
        updateFood({ foodId: selectedFood?._id, data: values });
      } else {
        createFood(values);
      }
    },
  })
  const { mutate: updateFood } = useUpdateFood(
    () => {
      toast.success("Food updated successfully");
      onClose()
      client.invalidateQueries(["foods"]);
      foodForm.resetForm()
    },
    (err) => {
      toast.error(err?.response?.data?.message || "Failed to update food");
    }
  )
  const { mutate: createFood, isLoading } = useCreateFood(
    () => {
      toast.success("Food added successfully");
      onClose()
      client.invalidateQueries(["foods"]);
      foodForm.resetForm()
    },
    (err) => {
      toast.error(err?.response?.data?.message || "Failed to add food");
    }
  );
  const handleClose = () => {
    foodForm.resetForm()
    setSelectedFood(null)
    onClose()
  }

  useEffect(() => {
    if (selectedFood) {
      foodForm.setValues({
        name: selectedFood.name || "",
        servingSize: selectedFood.servingSize || "",
        calories: selectedFood.calories || "",
        protein: selectedFood.protein || "",
        carbs: selectedFood.carbs || "",
        fats: selectedFood.fats || "",
      });
    }
  }, [selectedFood]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "22px",
          position: "relative",
          overflow: "hidden",

          /* Glass paper */
          background: "rgba(30,30,40,0.85)",
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
        {isEditMode ? "Edit Food" : "Add Food"}
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        sx={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
          color: "white",
        }}
      >
        <Grid container spacing={2} mt={1}>
          <Grid size={12}>
            <CustomInput
              label="Food Name"
              placeholder="Food Name"
              name="name"
              formik={foodForm}
            />
          </Grid>

          <Grid size={12}>
            <CustomInput
              label="Serving Size"
              placeholder="ex. 1 cup"
              name="servingSize"
              formik={foodForm}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInput
              label="Calories (kcal)"
              placeholder="Calories"
              name="calories"
              type="number"
              formik={foodForm}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInput
              label="Protein (g)"
              placeholder="Protein"
              name="protein"
              type="number"
              formik={foodForm}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInput
              label="Carbs (g)"
              placeholder="Carbs"
              name="carbs"
              type="number"
              formik={foodForm}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInput
              label="Fats (g)"
              placeholder="Fats"
              name="fats"
              type="number"
              formik={foodForm}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          position: "relative",
          zIndex: 1,
          background: "transparent",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Button
          onClick={handleClose}
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
          disabled={isLoading}
          onClick={() => foodForm.handleSubmit()}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 14px rgba(139,92,246,0.8)",
          }}
        >
          {isEditMode ? "Update Food" : "Add Food"}
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default AddFoodDialog;

const foodValues = {
  calories: '',
  servingSize: '',
  fats: '',
  protein: '',
  carbs: '',
  name: ""
}
