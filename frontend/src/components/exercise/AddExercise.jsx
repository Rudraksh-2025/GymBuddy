import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useCreateExercise } from '../../Api/Api';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BootstrapInput } from '../../common/custom/BootsrapInput';

const AddExercise = ({ open, onClose, onSubmit, muscle, defaultValues }) => {
  const [exerciseName, setExerciseName] = useState('')

  const queryClient = useQueryClient();
  const { mutate: createExercise, isPending } = useCreateExercise(
    () => {
      toast.success('Exercise created successfully!');
      queryClient.invalidateQueries({ queryKey: ["exerciseList"], exact: false });
      resetForm();
    },
    (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create exercise.');
    }
  );
  // const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory({
  //     onSuccess: () => {
  //         toast.success('Category updated successfully!');
  //         queryClient.invalidateQueries({ queryKey: ["categories"], exact: false });
  //         resetForm();
  //     },
  //     onError: (error) => {
  //         toast.error(error?.response?.data?.message || 'Failed to update category.');
  //     }
  // });
  // Reset all form fields
  const resetForm = () => {
    setExerciseName('')
    onClose();
  };


  const handleSubmit = () => {
    const payload = {
      muscleGroup: muscle,
      exerciseName: exerciseName
    };
    if (!muscle) {
      toast.error('please add muscle group first')
    }
    else {
      if (defaultValues) {
        updateCategory({ categoryId: defaultValues.productCategory_id, data: payload });
      } else {
        createExercise(payload);
      }
    }
  };



  return (
    <Dialog
      open={open}
      onClose={resetForm}
      maxWidth="xs"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.55)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
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
          position: "relative",
          zIndex: 1,
          background: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 700 }}>
          Enter Exercise Name
        </Typography>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        sx={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
          color: "white",
          mt: 2
        }}
      >
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
          <InputLabel
            shrink
            htmlFor="bootstrap-input-exerciseName"
            sx={{
              fontSize: "1.3rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
              "&.Mui-focused": { color: "white" },
            }}
          >
            Exercise Name
          </InputLabel>

          <BootstrapInput
            name="exerciseName"
            id="bootstrap-input-exerciseName"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            sx={{
              mt: 1,
              color: "white",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
            }}
          />
        </FormControl>
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
          gap: 1.5,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={resetForm}
          sx={{
            height: "44px",
            px: 3,
            borderRadius: "10px",
            color: "white",
            background: "rgba(255,255,255,0.08)",
            "&:hover": { background: "rgba(255,255,255,0.15)" },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          sx={{
            height: "44px",
            px: 3,
            borderRadius: "12px",
            color: "white",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 14px rgba(139,92,246,0.8)",
            "&:disabled": { opacity: 0.6 },
          }}
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default AddExercise;