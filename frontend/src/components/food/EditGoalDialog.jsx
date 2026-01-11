import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    Grid,
  } from "@mui/material";
  import { useFormik } from "formik";
  import { useQueryClient } from "@tanstack/react-query";
  import { useUpdateDailyGoal } from "../../Api/Api";
  import { toast } from "react-toastify";
  import CustomInput from "../../common/custom/CustomInput";
  
  const calcGrams = (cal, pct, div) =>
    Math.round(((cal * pct) / 100) / div);
  
  const EditGoalDialog = ({ open, onClose, data }) => {
    const client = useQueryClient();
  
    const { mutate: updateGoal, isPending } = useUpdateDailyGoal(
      () => {
        toast.success("Goals updated");
        client.invalidateQueries(["foodSummary"], { exact: false });
        onClose();
      },
      (err) => {
        toast.error(err?.response?.data?.message || "Failed to update goals");
      }
    );
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        calories: data?.today?.goal?.calories || 2000,
        proteinPct: data?.macrosPct?.protein || 25,
        carbsPct: data?.macrosPct?.carbs || 50,
        fatsPct: data?.macrosPct?.fats || 25,
      },
      onSubmit: (values) => {
        console.log(values)
        updateGoal(values);
      },
    });
  
    const { calories, proteinPct, carbsPct, fatsPct } = formik.values;
  
    const totalPct = Number(proteinPct) + Number(carbsPct) + Number(fatsPct);
  
    const proteinG = calcGrams(calories, proteinPct, 4);
    const carbsG = calcGrams(calories, carbsPct, 4);
    const fatsG = calcGrams(calories, fatsPct, 9);
  
    const pctError = totalPct !== 100;
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
       <DialogTitle sx={{ textAlign: "center", bgcolor: "#404040", color: "white" }}>Edit Daily Goals</DialogTitle>
  
       <DialogContent sx={{ bgcolor: "#404040", color: "white" }}>
          <Box mt={1}>
            <CustomInput
              label="Total Calories (kcal)"
              name="calories"
              type="number"
              formik={formik}
            />
          </Box>
  
          <Grid container spacing={2} mt={2}>
            <Grid size={4}>
              <CustomInput
                label="Protein %"
                name="proteinPct"
                type="number"
                formik={formik}
              />
            </Grid>
            <Grid size={4}>
              <CustomInput
                label="Carbs %"
                name="carbsPct"
                type="number"
                formik={formik}
              />
            </Grid>
            <Grid size={4}>
              <CustomInput
                label="Fats %"
                name="fatsPct"
                type="number"
                formik={formik}
              />
            </Grid>
          </Grid>
  
          {/* % VALIDATION */}
          <Box mt={2}>
            <Typography
              fontSize={15}
              fontWeight={600}
              color={pctError ? "error.main" : "success.main"}
            >
              Total: {totalPct}% {pctError && "(must be 100%)"}
            </Typography>
          </Box>
  
          {/* AUTO CALC GRAMS */}
          <Box
            mt={2}
            p={2}
            border="1px solid #E5E7EB"
            borderRadius="10px"
          >
            <Typography fontWeight={600} mb={1}>
              Daily Macro Targets
            </Typography>
  
            <Grid container>
              <Grid size={4}>
                <Typography fontWeight={600}>{proteinG} g</Typography>
                <Typography fontSize={12}>Protein</Typography>
              </Grid>
              <Grid size={4}>
                <Typography fontWeight={600}>{carbsG} g</Typography>
                <Typography fontSize={12}>Carbs</Typography>
              </Grid>
              <Grid size={4}>
                <Typography fontWeight={600}>{fatsG} g</Typography>
                <Typography fontSize={12}>Fats</Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
  
        <DialogActions sx={{ px: 3, pb: 2, bgcolor: "#404040" }}>
          <Button onClick={onClose} sx={{color:'white'}}>Cancel</Button>
          <Button
            variant="contained"
            disabled={pctError || isPending}
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditGoalDialog;
  