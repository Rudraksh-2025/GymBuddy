import React from "react";
import { FormControl, InputLabel, FormHelperText } from "@mui/material";
import { BootstrapInput } from "../custom/BootsrapInput";

const CustomInput = ({ label, placeholder, name, formik, readOnly = false, type = "text", theme = 'dark' }) => {
    return (

        <FormControl variant="standard" fullWidth>
            {label && (
                <InputLabel
                    shrink
                    htmlFor={name}
                    sx={{
                        fontSize: "1.3rem",
                        fontWeight: 450,
                        color: theme == 'dark' ? 'white' : 'black',
                        '&.Mui-focused': { color: theme == 'dark' ? 'white' : 'black' }
                    }}
                >
                    {label}
                </InputLabel>
            )}

            <BootstrapInput
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly={readOnly}
                sx={{ color: theme == 'dark' ? 'white' : 'black', '&:focus': { color: theme == 'dark' ? 'white' : 'black' } }}
            />

            {formik.touched[name] && formik.errors[name] && (
                <FormHelperText error>{formik.errors[name]}</FormHelperText>
            )}
        </FormControl>

    );
};

export default CustomInput;
