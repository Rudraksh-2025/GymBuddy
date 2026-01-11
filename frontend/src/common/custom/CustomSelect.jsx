// src/common/CustomSelect.jsx
import React from 'react';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';

const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    theme = 'light',
    helperText,
    ...props
}) => (
    <FormControl fullWidth error={!!error}>
        {label && <label style={{ marginBottom: 8 ,color:'white'}}>{label}</label>}
        <Select
            name={name}
            value={value}
            onChange={onChange}
            displayEmpty
            sx={{
                height: 45,
                mt: '3px',
                '& .MuiSelect-select': {
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme === 'dark' ? 'white' : value ? 'inherit !important' : '#878787 !important',
                },
                '& .MuiSelect-icon': {
                    color: theme === 'dark' ? '#ffffff' : 'inherit',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E3E7 !important',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E3E7 !important',
                },
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E3E7 !important',
                    },
                    boxShadow: 'none',
                },
            }}
            {...props}
        >
            <MenuItem value="">
                <em>Select {label}</em>
            </MenuItem>
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}

    </FormControl>
);

export default CustomSelect;