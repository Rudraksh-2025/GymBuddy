import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";
import dayjs from "dayjs";
import { useCreateWeight } from "../../Api/Api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const AddWeightDialog = ({ open, onClose, onSave, lastWeight }) => {
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle fontWeight={600}>Add Weight Entry</DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Weight (kg)"
                        fullWidth
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Enter your weight"
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{ background: "#00DCE2", color: "#000", textTransform: "none" }}
                    onClick={handleSubmit}
                    disabled={!weight}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddWeightDialog;
