import React, { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { BootstrapInput } from "../custom/BootsrapInput";
import calender from "../../assets/images/calender.svg";

const CustomDayPicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);

    const displayDate = value
        ? value instanceof Date
            ? value.toLocaleDateString()
            : new Date(value).toLocaleDateString()
        : "";

    return (
        <>
            {/* Trigger Input */}
            <BootstrapInput
                sx={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    color: "white",
                    "& .MuiInputBase-input": {
                        borderRadius: "8px",
                        height: '30px',
                        borderColor: "rgba(255,255,255,0.45)",
                    },

                }}
                value={displayDate}
                placeholder="Select date"
                onClick={() => setOpen(true)}
                readOnly
                fullWidth
                endAdornment={
                    <Box
                        onClick={() => setOpen(true)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            position: "absolute",
                            right: "10px",
                            top: "30%",
                        }}
                    >
                        <img src={calender} alt="calendar" style={{ width: 18, height: 18 }} />
                    </Box>
                }
            />

            {/* Glass Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "18px",
                        background: "rgba(30,30,40,0.9)",
                        backdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        boxShadow: `
              inset 0 0 0.5px rgba(255,255,255,0.5),
              0 20px 60px rgba(0,0,0,0.6)
            `,
                    },
                }}
            >
                <DialogContent sx={{ p: 2 }}>
                    {/* Calendar Wrapper */}

                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            onChange(date);
                            setOpen(false);
                        }}
                        disabled={{ after: new Date() }}
                        className="glass-day-picker"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CustomDayPicker;
