import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box, FormControl, InputLabel
} from "@mui/material";
import dayjs from "dayjs";
import { useCreateWeight } from "../../Api/Api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BootstrapInput } from "../../common/custom/BootsrapInput";
import CustomDayPicker from '../../common/custom/CustomDayPicker'

const AddWeightDialog = ({ open, onClose }) => {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [weight, setWeight] = useState("");
  const client = useQueryClient()
  const onSuccess = () => {
    toast.success("Weight Lod added successfully");
    client.invalidateQueries(['weight'], { exact: false })
  }
  const onError = (err) => {
    console.log(err)
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
  const { mutate: addWeight } = useCreateWeight(onSuccess, onError)
  const handleSubmit = () => {
    const weightFloat = parseFloat(weight);

    addWeight({
      date,
      weight: weightFloat,
    });

    onClose();
  };


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
        fontWeight={600}
        sx={{
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          background: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        Add Weight Entry
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        sx={{
          position: "relative",
          zIndex: 1,
          mt: 2,
          background: "transparent",
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* DATE */}
          <CustomDayPicker
            value={date}
            onChange={(date) => setDate(date)}
          />
          {/* <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiInputBase-root": {
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                borderRadius: "12px",
                color: "white",
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.8)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.25)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.45)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8B5CF6",
              },
            }}
          /> */}

          {/* WEIGHT */}
          <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
            <InputLabel
              shrink
              htmlFor="weight"
              className="login-input-label"
            >
              Weight (kg)
            </InputLabel>

            <BootstrapInput
              id="weight"
              name="weight"
              placeholder="Enter your Weight"
              value={weight}
              type="number"
              onChange={(e) => setWeight(e.target.value)}
              className="login-textField"
            />
          </FormControl>
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
            textTransform: "none",
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
          disabled={!weight}
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
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

export default AddWeightDialog;
