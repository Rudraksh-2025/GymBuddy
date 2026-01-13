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
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { startOfYear } from "date-fns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


const CustomDateRangePicker = ({
  value,
  onChange,
  borderColor = 'var(--light-gray)',
  buttonLabel = 'Select Date Range',
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
              width: "260px",
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
              {`${format(value[0].startDate, "dd MMM yy")} - ${format(
                value[0].endDate,
                "dd MMM yy"
              )}`}
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
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                p: 2,
                borderRadius: "18px",
                background: "rgba(30,30,40,0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: `
                inset 0 0 0.5px rgba(255,255,255,0.6),
                0 20px 60px rgba(0,0,0,0.6)`,
              }}
            >

              {/* Quick Select Options */}
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                gap={1}
                sx={{
                  minWidth: 100,
                  p: 1,
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: { xs: 'row', sm: 'column' }, gap: 0 }}>
                  {[
                    { label: "Last Week", days: 7 },
                    { label: "Last Month", days: 30 },
                    { label: "Last 3 Months", days: 90 },
                    { label: "Last 6 Months", days: 180 },
                    { label: "Last 12 Months", days: 365 },
                  ].map((option) => (
                    <Button
                      key={option.label}
                      size="small"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - option.days);
                        onChange([{ startDate: start, endDate: end, key: "selection" }]);
                        setAnchorEl(null);
                      }}
                      sx={{
                        justifyContent: "flex-start",
                        color: "white",
                        borderRadius: "10px",
                        textTransform: "none",
                        "&:hover": { background: "rgba(255,255,255,0.12)" },
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>

                <Button
                  size="small"
                  onClick={() => {
                    const today = new Date();
                    const start = startOfYear(today);
                    onChange([{ startDate: start, endDate: today, key: "selection" }]);
                    setAnchorEl(null);
                  }}
                  sx={{
                    color: "#F87171",
                    borderRadius: "10px",
                    "&:hover": { background: "rgba(248,113,113,0.15)" },
                  }}
                >
                  Reset
                </Button>
              </Box>


              {/* Calendar Picker */}
              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <DateRange
                  editableDateInputs
                  onChange={(item) => onChange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={value}
                  rangeColors={["#8B5CF6"]} // purple accent to match theme
                />
              </Box>

            </Box>
          </Popper>

        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default CustomDateRangePicker;
