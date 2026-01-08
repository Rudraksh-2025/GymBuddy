// CustomDateRangePicker.jsx
import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    ClickAwayListener,
    Typography,
    Popper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { startOfYear } from "date-fns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';



const CustomDatePicker = ({
    value,
    onChange,
    borderColor = 'var(--light-gray)',
    buttonSx = {},
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const popperOpen = Boolean(anchorEl);
    const buttonRef = useRef(null);

    const handleToggle = () => {
        setAnchorEl(popperOpen ? null : buttonRef.current);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    return (
        <Box position="relative">
            <ClickAwayListener onClickAway={handleClickAway}>
                <Box>
                    <Button
                        ref={buttonRef}
                        onClick={handleToggle}
                        variant="outlined"
                        sx={{
                            height: '40px',
                            width: '200px',
                            borderRadius: '8px',
                            borderWidth: '1px',
                            justifyContent: 'space-between',
                            borderColor: borderColor,
                            borderStyle: 'solid',
                            '&:hover': {
                                borderColor: borderColor,
                            },
                            ...buttonSx,
                        }}
                        endIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    >
                        <CalendarMonthIcon sx={{ color: 'white', mr: 1 }} />

                        <Typography variant="body2" sx={{ textTransform: 'none', color: 'white', }}>
                            {format(value, 'dd MMM yyyy')}
                        </Typography>
                    </Button>

                    <Popper
                        open={popperOpen}
                        anchorEl={anchorEl}
                        placement="bottom-start"
                        sx={{ zIndex: 2000, mt: 1 }}
                    >
                        <Box sx={{ boxShadow: 3, borderRadius: 2, gap: 3, display: 'flex', flexDirection: 'row', backgroundColor: 'white', p: 2 }}>
                            {/* Calendar Picker */}
                            <Calendar
                                date={value}
                                onChange={(date) => {
                                    onChange(date);
                                    setAnchorEl(null);
                                }}
                                color="#1976d2"
                            />

                        </Box>
                    </Popper>

                </Box>
            </ClickAwayListener>
        </Box>
    );
};

export default CustomDatePicker;
