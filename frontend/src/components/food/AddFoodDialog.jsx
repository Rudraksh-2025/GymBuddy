import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material";
import { foodValidation } from "../../common/FormValidation";
import CustomInput from "../../common/custom/CustomInput";
import { useFormik } from "formik";
import { useCreateFood } from "../../Api/Api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AddFoodDialog = ({ open, onClose }) => {
    const client = useQueryClient()
    const foodForm = useFormik({
        initialValues: foodValues,
        validationSchema: foodValidation,

        onSubmit: (values) => {
            createFood(values);
        },
    })
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
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" >
            <DialogTitle >Add Food</DialogTitle>

            <DialogContent>
                <Grid container spacing={2} mt={1}>
                    <Grid size={12}>

                        <CustomInput
                            label="Food Name"
                            placeholder="Food Name"
                            name="name"
                            theme='light'
                            formik={foodForm}
                        />
                    </Grid>



                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                            label="Calories (kcal)"
                            placeholder="Calories"
                            name="calories"
                            type="number"
                            theme='light'
                            formik={foodForm}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <CustomInput
                            label="Protein (g)"
                            placeholder="Protein"
                            name="protein"
                            type="number"
                            theme='light'

                            formik={foodForm}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <CustomInput
                            label="Carbs (g)"
                            placeholder="Carbs"
                            name="carbs"
                            type="number"
                            theme='light'

                            formik={foodForm}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <CustomInput
                            label="Fats (g)"
                            placeholder="Fats"
                            name="fats"
                            type="number"
                            theme='light'

                            formik={foodForm}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} sx={{ color: 'black' }}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => foodForm.handleSubmit()}
                    disabled={isLoading}
                >
                    Add Food
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFoodDialog;

const foodValues = {
    calories: '',
    fats: '',
    protein: '',
    carbs: '',
    name: ""
}
