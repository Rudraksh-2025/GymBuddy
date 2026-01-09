import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, CircularProgress, TextField, FormControl, InputLabel } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import CustomInput from "../../common/custom/CustomInput";
import CustomSelect from "../../common/custom/CustomSelect";
import { BootstrapInput } from "../../common/custom/BootsrapInput";
import { useCreateFoodLog } from '../../Api/Api'
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGetFoods } from '../../Api/Api'

const MEALS = [
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snacks", value: "snacks" },
];

const AddFoodLog = ({
    open,
    onClose,
    date,
    defaultMeal = "breakfast",
    onSubmit,
}) => {
    const queryClient = useQueryClient();
    const { data: foods } = useGetFoods()
    const { mutate } = useCreateFoodLog(
        () => {
            toast.success("Food Log added");
            queryClient.invalidateQueries({ queryKey: ["foodLogs"] });
            queryClient.invalidateQueries({ queryKey: ["foodSummary"] });
            onClose();
        },
        (err) => {
            toast.error(err?.response?.data?.message || "Failed to add food");
        }
    );
    const foodForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            foodId: "",
            quantity: 1,
            mealType: defaultMeal,
        },
        onSubmit: (values) => {
            const selectedFood = foods?.data?.find((f) => f._id === values.foodId);
            if (!selectedFood) {
                toast.error("Please select food");
                return;
            }

            const qty = Number(values.quantity);

            mutate({
                foodId: values.foodId,
                quantity: qty,
                mealType: values.mealType,
                date,
                calories: Number((selectedFood.calories * qty).toFixed(0)),
                protein: Number((selectedFood.protein * qty).toFixed(1)),
                carbs: Number((selectedFood.carbs * qty).toFixed(1)),
                fats: Number((selectedFood.fats * qty).toFixed(1)),
            });
        },
    });

    useEffect(() => {
        if (open) foodForm.resetForm();
    }, [open]);

    // ---------- DERIVED DATA ----------
    const selectedFood = useMemo(
        () => foods?.data?.find((f) => f._id === foodForm.values.foodId),
        [foods?.data, foodForm.values.foodId]
    );

    const qty = Number(foodForm.values.quantity || 0);

    const calories = selectedFood ? (selectedFood.calories * qty).toFixed(0) : 0;
    const protein = selectedFood ? (selectedFood.protein * qty).toFixed(1) : 0;
    const carbs = selectedFood ? (selectedFood.carbs * qty).toFixed(1) : 0;
    const fats = selectedFood ? (selectedFood.fats * qty).toFixed(1) : 0;

    const progress = Math.min((calories / 2000) * 100, 100);


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ textAlign: "center", bgcolor: "#404040", color: "white" }}>
                Add Food
            </DialogTitle>

            <DialogContent sx={{ bgcolor: "#404040", color: "white" }}>
                {/* FOOD */}

                <CustomSelect
                    label="Food"
                    name="foodId"
                    value={foodForm.values.foodId}
                    theme='dark'
                    onChange={foodForm.handleChange}
                    options={foods?.data?.map((f) => ({
                        label: f.name,
                        value: f._id,
                    }))}
                />

                {/* qty */}
                <Box mt={2}>
                    <FormControl variant="standard" fullWidth>

                        <InputLabel
                            shrink
                            htmlFor='servingSize'
                            sx={{
                                fontSize: "1.3rem",
                                fontWeight: 450,
                                color: 'white',
                                '&.Mui-focused': { color: 'white' }
                            }}
                        >
                            Serving Size
                        </InputLabel>
                        <BootstrapInput
                            id='servingSize'
                            name='servingSize'
                            placeholder='Serving Size'
                            value={selectedFood?.servingSize}
                            readOnly
                            sx={{ color: 'white', '&:focus': { color: 'white' } }}
                        />
                    </FormControl>
                </Box>
                {/* Number of Serving */}
                <Box mt={2}>
                    <CustomInput
                        label="Number of Servings"
                        name="quantity"
                        type="number"
                        formik={foodForm}
                        inputProps={{ min: 0.25, step: 0.25 }}
                    />
                </Box>

                {/* MEAL */}
                <Box mt={2}>
                    <CustomSelect
                        label="Meal"
                        name="mealType"
                        theme='dark'
                        value={foodForm.values.mealType}
                        onChange={foodForm.handleChange}
                        options={MEALS}
                    />
                </Box>

                {/* MACRO PREVIEW */}
                <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                    {/* RING */}
                    <Box position="relative" display="inline-flex">
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={90}
                            sx={{ color: "white" }}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={progress}
                            size={90}
                            sx={{ color: "#22C55E", position: "absolute", left: 0 }}
                        />
                        <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center" flexDirection="column" >
                            <Typography fontWeight={700}>{calories}</Typography>
                            <Typography fontSize={12} color="white">
                                cal
                            </Typography>
                        </Box>
                    </Box>

                    {/* MACROS */}
                    <Box textAlign="center">
                        <Typography fontWeight={600}>{carbs} g</Typography>
                        <Typography fontSize={15} color="white">
                            Carbs
                        </Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography fontWeight={600}>{fats} g</Typography>
                        <Typography fontSize={15} color="white">
                            Fat
                        </Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography fontWeight={600}>{protein} g</Typography>
                        <Typography fontSize={15} color="white">
                            Protein
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, bgcolor: "#404040" }}>
                <Button onClick={onClose} sx={{ color: 'white' }}>Cancel</Button>
                <Button variant="contained" onClick={foodForm.handleSubmit}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFoodLog;
