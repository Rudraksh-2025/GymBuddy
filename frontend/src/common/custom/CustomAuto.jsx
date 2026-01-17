import React from "react";
import {
    FormControl,
    TextField,
    FormHelperText,
    Autocomplete, Box, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const CustomAuto = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    theme = "light",
    helperText,
    placeholder,
    ReadOnly = false,
    onDeleteOption,
    showDelete = false,
    ...props
}) => {
    // find selected option object from value
    const selectedOption =
        options.find((opt) => opt.value === value) || null;

    return (
        <FormControl fullWidth error={!!error}>
            {label && <label style={{ marginBottom: 8, color: "white" }}>{label}</label>}

            <Autocomplete
                options={options}
                value={selectedOption}
                onChange={(e, newValue) => {
                    onChange({
                        target: {
                            name,
                            value: newValue ? newValue.value : "",
                        },
                    });
                }}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                }
                readOnly
                noOptionsText="No data available"
                renderOption={(props, option) => (
                    <Box
                        component="li"
                        {...props}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "black",
                            width: "100%",
                        }}
                    >
                        <span>{option.label}</span>

                        {showDelete && !ReadOnly && (
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation(); // ⛔ prevent select
                                    onDeleteOption?.(option.value);
                                }}
                                sx={{
                                    color: "red",
                                    "&:hover": {
                                        background: "rgba(248,113,113,0.15)",
                                    },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name={name}
                        placeholder={placeholder || `Select ${label}`}
                        error={!!error}
                        disabled={ReadOnly}
                        sx={{

                            mt: "3px",
                            "& .MuiInputBase-root": {
                                height: 45,
                                color: "white",
                                background: "transparent",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E0E3E7 !important",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E0E3E7 !important",
                            },
                            "& input::placeholder": {
                                color: theme === "dark" ? "#bdbdbd" : "#878787",
                                opacity: 1,
                            },
                            "& .MuiAutocomplete-popupIndicator": {
                                color: "white",
                                display: ReadOnly ? "none" : "flex",
                            },

                            "& .MuiAutocomplete-clearIndicator": {
                                color: "white",
                            },
                        }}
                    />
                )}
                {...props}
            />

            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default CustomAuto;
