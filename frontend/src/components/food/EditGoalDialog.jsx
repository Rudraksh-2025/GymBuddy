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
        Edit Daily Goals
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        sx={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
          color: "white",
          mt: 1,
          p: { xs: 2, sm: 3 }
        }}
      >
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
            <CustomInput label="Protein %" name="proteinPct" type="number" formik={formik} />
          </Grid>
          <Grid size={4}>
            <CustomInput label="Carbs %" name="carbsPct" type="number" formik={formik} />
          </Grid>
          <Grid size={4}>
            <CustomInput label="Fats %" name="fatsPct" type="number" formik={formik} />
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

        {/* AUTO CALC GRAMS — GLASS BOX */}
        <Box
          mt={2}
          p={2}
          borderRadius="14px"
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
          <Typography fontWeight={600} mb={1}>
            Daily Macro Targets
          </Typography>

          <Grid container>
            <Grid size={4}>
              <Typography fontWeight={600}>{proteinG} g</Typography>
              <Typography fontSize={12} sx={{ opacity: 0.75 }}>
                Protein
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography fontWeight={600}>{carbsG} g</Typography>
              <Typography fontSize={12} sx={{ opacity: 0.75 }}>
                Carbs
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography fontWeight={600}>{fatsG} g</Typography>
              <Typography fontSize={12} sx={{ opacity: 0.75 }}>
                Fats
              </Typography>
            </Grid>
          </Grid>
        </Box>
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
          disabled={pctError || isPending}
          onClick={formik.handleSubmit}
          sx={{
            borderRadius: "12px",
            px: 3,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 14px rgba(139,92,246,0.8)",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default EditGoalDialog;
