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
import { useCreateExercise } from '../../api/Api';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BootstrapInput } from '../../common/custom/BootsrapInput';

const AddExercise = ({ open, onClose, onSubmit, muscle, defaultValues }) => {
    const [exerciseName, setExerciseName] = useState('')

    const queryClient = useQueryClient();
    const { mutate: createExercise, isPending } = useCreateExercise(
        () => {
            toast.success('Exercise created successfully!');
            queryClient.invalidateQueries({ queryKey: ["muscleGroup"], exact: false });
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
        <Dialog open={open} onClose={resetForm} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Enter Exercise Name
            </DialogTitle>

            <DialogContent>
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                    <InputLabel shrink htmlFor="bootstrap-input-exerciseName">
                        Exercise Name :
                    </InputLabel>
                    <BootstrapInput
                        name="exerciseName"
                        id="bootstrap-input-exerciseName"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                    />
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    {(isPending) ? 'Submitting...' : 'Submit'}
                </Button>
                <Button onClick={resetForm}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddExercise;