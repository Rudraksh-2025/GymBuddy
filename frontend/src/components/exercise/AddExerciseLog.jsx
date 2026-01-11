import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Button,
    IconButton,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useCreateExerciselog, useGetExercise } from '../../Api/Api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';

const AddExerciseLog = ({ open, onClose, muscle }) => {
    const [exerciseId, setExerciseId] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);

    const client = useQueryClient()

    const { data: exercises } = useGetExercise(muscle);

    const { mutate: createLog, isPending } = useCreateExerciselog(
        (data) => {
            console.log("✅ Success response:", data);
            toast.success("Exercise log added successfully!");
            client.invalidateQueries(['muscleGroup'], { exact: false })
        },
        (error) => {
            console.log("❌ Error response:", error);
            toast.error(error?.response?.data?.message || "Failed to add log");
        }
    );

    const handleAddSet = () => {
        setSets([...sets, { reps: '', weight: '' }]);
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleSetChange = (index, field, value) => {
        const updated = [...sets];
        updated[index][field] = value;
        setSets(updated);
    };

    const handleSubmit = () => {
        const payload = {
            exerciseId,
            date,
            sets: sets.map(s => ({
                reps: Number(s.reps),
                weight: Number(s.weight)
            }))
        };
        createLog(payload);
        setExerciseId('')
        onClose();
    };

    const handleClose = () => {
        setExerciseId('');
        setDate(dayjs().format('YYYY-MM-DD'));
        setSets([{ reps: '', weight: '' }]);
        onClose();
    };

    return (
       <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
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
      fontSize: "1.4rem",
      fontWeight: 700,
      textAlign: "center",
      position: "relative",
      zIndex: 1,
      background: "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.15)",
    }}
  >
    Add Exercise Log
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
    <Box mt={2}>
      {/* Select Exercise */}
      <FormControl fullWidth margin="normal">
        <InputLabel
          id="exercise-select"
          sx={{
            color: "rgba(255,255,255,0.8)",
            "&.Mui-focused": { color: "white" },
          }}
        >
          Exercise
        </InputLabel>

        <Select
          labelId="exercise-select"
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
          sx={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            color: "white",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.25)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.45)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8B5CF6",
            },
            "& .MuiSelect-icon": { color: "white" },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                background: "rgba(20,20,30,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
              },
            },
          }}
        >
          {exercises?.map((ex) => (
            <MenuItem key={ex.id} value={ex.id}>
              {ex.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Date */}
      <TextField
        type="date"
        label="Date"
        fullWidth
        margin="normal"
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
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B5CF6",
          },
        }}
      />

      {/* Sets */}
      <Typography variant="h6" mt={2} fontWeight={600}>
        Sets
      </Typography>

      {sets.map((set, idx) => (
        <Box
          key={idx}
          display="flex"
          gap={1.5}
          alignItems="center"
          mt={1}
          borderRadius="12px"
        >
          <TextField
            label="Reps"
            type="number"
            value={set.reps}
            onChange={(e) => handleSetChange(idx, "reps", e.target.value)}
            sx={{
                  background: "rgba(255,255,255,0.08)",
              "& .MuiInputBase-root": { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.25)",
              },
            }}
          />

          <TextField
            label="Weight"
            type="number"
            value={set.weight}
            onChange={(e) => handleSetChange(idx, "weight", e.target.value)}
            sx={{
                  background: "rgba(255,255,255,0.08)",
              "& .MuiInputBase-root": { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.25)",
              },
            }}
          />

          {sets.length > 1 && (
            <IconButton
              onClick={() => handleRemoveSet(idx)}
              sx={{
                color: "#F87171",
                "&:hover": { background: "rgba(248,113,113,0.15)" },
              }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}

      <Button
        startIcon={<Add />}
        onClick={handleAddSet}
        sx={{
          mt: 2,
          color: "#A78BFA",
          textTransform: "none",
        }}
      >
        Add Set
      </Button>
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
      gap: 1.5,
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
      onClick={handleSubmit}
      disabled={!exerciseId || sets.length === 0 || isPending}
      sx={{
        borderRadius: "12px",
        px: 3,
        color: "white",
        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
        boxShadow: "0 0 14px rgba(139,92,246,0.8)",
        "&:disabled": { opacity: 0.6 },
      }}
    >
      {isPending ? "Saving..." : "Save"}
    </Button>
  </DialogActions>
</Dialog>

    );
};

export default AddExerciseLog;