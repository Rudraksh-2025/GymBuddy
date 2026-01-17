import React from "react";
import {
    FormControl,
    TextField,
    FormHelperText,
    Autocomplete,
} from "@mui/material";

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
                noOptionsText="No data available"
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name={name}
                        placeholder={placeholder || `Select ${label}`}
                        error={!!error}
                        sx={{
                            mt: "3px",
                            "& .MuiInputBase-root": {
                                height: 45,
                                color: theme === "dark" ? "white" : "inherit",
                                background: theme === "dark" ? "transparent" : "inherit",
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
                                color: "white", // ✅ down arrow color
                            },

                            "& .MuiAutocomplete-clearIndicator": {
                                color: "white", // (optional) clear X icon also white
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
