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
              height: "42px",
              width: "220px",
              borderRadius: "12px",
              justifyContent: "space-between",

              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",

              "&:hover": {
                background: "rgba(255,255,255,0.18)",
                borderColor: "rgba(255,255,255,0.35)",
              },

              ...buttonSx,
            }}
            endIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <CalendarMonthIcon sx={{ color: "white", mr: 1 }} />

            <Typography variant="body2" sx={{ textTransform: "none", color: "white" }}>
              {format(value, "dd MMM yyyy")}
            </Typography>
          </Button>


          <Popper
            open={popperOpen}
            anchorEl={anchorEl}
            placement="bottom-start"
            sx={{ zIndex: 2000, mt: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                borderRadius: "18px",

                background: "rgba(30,30,40,0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: `
        inset 0 0 0.5px rgba(255,255,255,0.6),
        0 20px 60px rgba(0,0,0,0.6)
      `,
              }}
            >

              {/* Calendar Picker */}
              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",

                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.18)",

                  boxShadow: `
      inset 0 0 0.5px rgba(255,255,255,0.5),
      0 10px 30px rgba(0,0,0,0.5)
    `,
                }}
              >
                <Calendar
                  date={value}
                  onChange={(date) => {
                    onChange(date);
                    setAnchorEl(null);
                  }}
                  color="#8B5CF6"
                />
              </Box>



            </Box>
          </Popper>

        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default CustomDatePicker;
