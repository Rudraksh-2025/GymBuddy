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
import { useCreateExerciselog, useGetExercise } from '@/api/ApiCall';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const AddExerciseLog = ({ open, onClose, muscle }) => {
    const [exerciseId, setExerciseId] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);

    const { data: exercises } = useGetExercise(muscle);

    const { mutate: createLog, isPending } = useCreateExerciselog(
        (data) => {
            console.log("✅ Success response:", data);
            toast.success("Exercise log added successfully!");
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
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Exercise Log</DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    {/* Select Exercise */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="exercise-select">Exercise</InputLabel>
                        <Select
                            labelId="exercise-select"
                            value={exerciseId}
                            onChange={(e) => setExerciseId(e.target.value)}
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
                    />

                    {/* Sets */}
                    <Typography variant="h6" mt={2}>
                        Sets
                    </Typography>
                    {sets.map((set, idx) => (
                        <Box key={idx} display="flex" gap={2} alignItems="center" mt={1}>
                            <TextField
                                label="Reps"
                                type="number"
                                value={set.reps}
                                onChange={(e) => handleSetChange(idx, 'reps', e.target.value)}
                            />
                            <TextField
                                label="Weight"
                                type="number"
                                value={set.weight}
                                onChange={(e) => handleSetChange(idx, 'weight', e.target.value)}
                            />
                            {sets.length > 1 && (
                                <IconButton color="error" onClick={() => handleRemoveSet(idx)}>
                                    <Delete />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    <Button
                        startIcon={<Add />}
                        onClick={handleAddSet}
                        sx={{ mt: 2 }}
                    >
                        Add Set
                    </Button>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!exerciseId || sets.length === 0 || isPending}
                >
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddExerciseLog;
