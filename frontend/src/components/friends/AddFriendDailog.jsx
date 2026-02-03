import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TagIcon from "@mui/icons-material/Tag";
import { useCreateFriend } from "../../Api/Api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AddFriendDialog = ({ open, onClose, onAdd }) => {
    const [code, setCode] = useState("");
    const client = useQueryClient()

    const handleAdd = () => {
        if (!code.trim()) return;
        const payload = { code: code }
        mutate(payload)
        setCode("");
    };
    const onSuccess = () => {
        toast.success("Friend added");
        client.invalidateQueries({ queryKey: ["leaderboard"] });
        onClose();
    }
    const onError = () => {
        toast.error(err?.response?.data?.message || "Failed to add friend");
    }
    const { mutate, isPending } = useCreateFriend(onSuccess, onError)

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    background: "rgba(15, 15, 20, 0.85)",
                    backdropFilter: "blur(16px)",
                    color: "white",
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>
                Add Friend
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ mb: 2, opacity: 0.7 }}>
                    Enter your friend's unique code to add them.
                </Typography>

                <TextField
                    autoFocus
                    fullWidth
                    placeholder="e.g. RX9A-23FQ"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <TagIcon sx={{ color: "#9CA3AF" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mt: 1,
                        "& .MuiInputBase-root": {
                            color: "white",
                        },
                        "& fieldset": {
                            borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(255,255,255,0.4)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#6366F1",
                        },
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ color: "#9CA3AF" }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAdd}
                    disabled={!code.trim() || isPending}
                    sx={{
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        fontWeight: 600,
                    }}
                >
                    {isPending ? "Adding..." : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFriendDialog;
