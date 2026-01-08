import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material";
import { foodValidation } from "../../common/FormValidation";
import CustomInput from "../../common/custom/CustomInput";
import { useFormik } from "formik";
import { useCreateFood, useUpdateFood } from "../../Api/Api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AddFoodDialog = ({ open, onClose, selectedFood, setSelectedFood }) => {
    const client = useQueryClient()
    const isEditMode = Boolean(selectedFood?._id);
    const foodForm = useFormik({
        initialValues: foodValues,
        validationSchema: foodValidation,

        onSubmit: (values) => {
            if (isEditMode) {
                updateFood({ foodId: selectedFood?._id, data: values });
            } else {
                createFood(values);
            }
        },
    })
    const { mutate: updateFood } = useUpdateFood(
        () => {
            toast.success("Food updated successfully");
            onClose()
            client.invalidateQueries(["foods"]);
            foodForm.resetForm()
        },
        (err) => {
            toast.error(err?.response?.data?.message || "Failed to update food");
        }
    )
    const { mutate: createFood, isLoading } = useCreateFood(
        () => {
            toast.success("Food added successfully");
            onClose()
            client.invalidateQueries(["foods"]);
            foodForm.resetForm()
        },
        (err) => {
            toast.error(err?.response?.data?.message || "Failed to add food");
        }
    );
    const handleClose = () => {
        foodForm.resetForm()
        setSelectedFood(null)
        onClose()
    }

    useEffect(() => {
        if (selectedFood) {
            foodForm.setValues({
                name: selectedFood.name || "",
                servingSize: selectedFood.servingSize || "",
                calories: selectedFood.calories || "",
                protein: selectedFood.protein || "",
                carbs: selectedFood.carbs || "",
                fats: selectedFood.fats || "",
            });
        }
    }, [selectedFood]);


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                },
            }} >
            <DialogTitle sx={{ textAlign: "center", bgcolor: " #262626", color: "white" }}>
                {isEditMode ? "Edit Food" : "Add Food"}
            </DialogTitle>

            <DialogContent sx={{ bgcolor: "#262626", color: "white" }}>
                <Grid container spacing={2} mt={1}>
                    <Grid size={12}>
                        <CustomInput
                            label="Food Name"
                            placeholder="Food Name"
                            name="name"
                            formik={foodForm}
                        />
                    </Grid>
                    <Grid size={12}>
                        <CustomInput
                            label="Serving Size"
                            placeholder="ex. 1 cup"
                            name="servingSize"
                            formik={foodForm}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                            label="Calories (kcal)"
                            placeholder="Calories"
                            name="calories"
                            type="number"
                            formik={foodForm}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <CustomInput
                            label="Protein (g)"
                            placeholder="Protein"
                            name="protein"
                            type="number"
                            formik={foodForm}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <CustomInput
                            label="Carbs (g)"
                            placeholder="Carbs"
                            name="carbs"
                            type="number"
                            formik={foodForm}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <CustomInput
                            label="Fats (g)"
                            placeholder="Fats"
                            name="fats"
                            type="number"
                            formik={foodForm}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, bgcolor: "#262626" }}>
                <Button onClick={handleClose} sx={{ color: 'white' }}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => foodForm.handleSubmit()}
                    disabled={isLoading}
                >
                    {isEditMode ? "Update Food" : "Add Food"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFoodDialog;

const foodValues = {
    calories: '',
    servingSize: '',
    fats: '',
    protein: '',
    carbs: '',
    name: ""
}
