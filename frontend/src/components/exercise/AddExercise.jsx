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
            <DialogTitle >
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Enter Exercise Name</Typography>
            </DialogTitle>

            <DialogContent>
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                    <InputLabel shrink htmlFor="bootstrap-input-exerciseName" sx={{ fontSize: '1.4rem' }}>
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
                    sx={{ color: 'white', backgroundColor: 'var(--Blue)', height: '50px', width: '100px', borderRadius: '10px' }}
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    {(isPending) ? 'Submitting...' : 'Submit'}
                </Button>
                <Button onClick={resetForm}
                    sx={{ color: 'black', border: '1px solid black', height: '50px', width: '100px', borderRadius: '10px' }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddExercise;