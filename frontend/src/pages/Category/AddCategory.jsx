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
import { useCreateCategory, useUpdateCategory } from '@/api/ApiCall';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddCategory = ({ open, onClose, onSubmit, defaultValues }) => {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [subCategoryInput, setSubCategoryInput] = useState('');
    const [type, setType] = useState('')
    const [SubCatName, setSubCatName] = useState([]);
    const [sizeInputs, setSizeInputs] = useState({});
    const [sizeInput, setSizeInput] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const queryClient = useQueryClient();
    const { mutate: createCategory, isPending } = useCreateCategory(
        () => {
            toast.success('Category created successfully!');
            queryClient.invalidateQueries({ queryKey: ["categories"], exact: false });
            resetForm();
        },
        (error) => {
            toast.error(error?.response?.data?.message || 'Failed to create category.');
        }
    );
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory({
        onSuccess: () => {
            toast.success('Category updated successfully!');
            queryClient.invalidateQueries({ queryKey: ["categories"], exact: false });
            resetForm();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update category.');
        }
    });
    // Reset all form fields
    const resetForm = () => {
        setStep(1);
        setCategory('');
        setSubCategoryInput('');
        setSubCatName([]);
        setSizeInputs({});
        setSizeInput('');
        setSelectedSubCategory('');
        onClose();
    };

    // Pre-fill data for edit mode
    useEffect(() => {
        if (defaultValues) {
            setStep(1);
            setCategory(defaultValues.name || '');
            setType(defaultValues.type)
            const subCatObj = defaultValues.subCatName || {};
            setSubCatName(Object.keys(subCatObj));
            setSizeInputs(subCatObj);
            setSelectedSubCategory('');
        }
    }, [defaultValues]);


    const handleAddSubCategory = () => {
        const trimmed = subCategoryInput.trim();
        if (!trimmed || SubCatName.includes(trimmed)) return;

        setSubCatName((prev) => [...prev, trimmed]);
        setSizeInputs((prev) => ({ ...prev, [trimmed]: [] }));
        setSubCategoryInput('');
    };

    const handleAddSize = () => {
        const trimmed = sizeInput.trim();
        if (!trimmed || sizeInputs[selectedSubCategory]?.includes(trimmed)) return;

        setSizeInputs((prev) => ({
            ...prev,
            [selectedSubCategory]: [...(prev[selectedSubCategory] || []), trimmed]
        }));
        setSizeInput('');
    };

    const handleSubmit = () => {
        const payload = {
            name: category,
            type: type,
            subCatName: sizeInputs
        };

        if (defaultValues) {
            updateCategory({ categoryId: defaultValues.productCategory_id, data: payload });
        } else {
            // create flow
            createCategory(payload);
        }
    };



    return (
        <Dialog open={open} onClose={resetForm} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {step === 1
                    ? 'Step 1: Enter Category'
                    : step === 2
                        ? 'Step 2: Add Sub Categories'
                        : `Step 3: Add Sub Items`}
            </DialogTitle>

            <DialogContent>
                {step === 1 && (
                    <Box display="flex" gap={1} mt={1}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="ad-type-label">Select Type</InputLabel>
                            <Select
                                labelId="ad-type-label"
                                value={type}
                                label="Select Type"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value="sublease">Sublease</MenuItem>
                                <MenuItem value="marketplace">Marketplace</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Category Name"
                            fullWidth
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Box>
                )}

                {step === 2 && (
                    <>
                        <Box display="flex" gap={1} mt={1}>
                            <TextField
                                label="Sub Category"
                                fullWidth
                                value={subCategoryInput}
                                onChange={(e) => setSubCategoryInput(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddSubCategory}>
                                Add
                            </Button>
                        </Box>

                        <Box mt={2}>
                            {SubCatName.map((sub, idx) => (
                                <Chip
                                    key={idx}
                                    label={sub}
                                    onClick={() => {
                                        setSelectedSubCategory(sub);
                                        setStep(3);
                                    }}
                                    onDelete={() => {
                                        setSubCatName((prev) => prev.filter((s) => s !== sub));
                                        setSizeInputs((prev) => {
                                            const newObj = { ...prev };
                                            delete newObj[sub];
                                            return newObj;
                                        });
                                        if (selectedSubCategory === sub) {
                                            setSelectedSubCategory('');
                                        }
                                    }}
                                    sx={{ m: 0.5, cursor: 'pointer' }}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </>
                )}

                {step === 3 && selectedSubCategory && (
                    <>
                        <Typography variant="h6" mt={1}>
                            Add sub Items for: <strong>{selectedSubCategory}</strong>
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <TextField
                                label="Sub Item"
                                fullWidth
                                value={sizeInput}
                                onChange={(e) => setSizeInput(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddSize}>
                                Add
                            </Button>
                        </Box>

                        <Box mt={2}>
                            {(sizeInputs[selectedSubCategory] || []).map((sz, idx) => (
                                <Chip
                                    key={idx}
                                    label={sz}
                                    onDelete={() =>
                                        setSizeInputs((prev) => ({
                                            ...prev,
                                            [selectedSubCategory]: prev[selectedSubCategory].filter(
                                                (s) => s !== sz
                                            )
                                        }))
                                    }
                                    sx={{ m: 0.5 }}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                {step > 1 && <Button onClick={() => setStep(step - 1)}>Back</Button>}
                {step < 2 && (
                    <Button
                        variant="contained"
                        onClick={() => setStep(step + 1)}
                        disabled={!category.trim() || !type}
                    >
                        Next
                    </Button>
                )}
                {step > 1 && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isUpdating}
                    >
                        {(isUpdating) ? 'Submitting...' : 'Submit'}
                    </Button>
                )}
                <Button onClick={resetForm}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCategory;
