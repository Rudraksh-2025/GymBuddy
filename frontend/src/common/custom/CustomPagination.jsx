import React from 'react'
import { Grid, Box, Typography, Select, MenuItem, IconButton } from '@mui/material'
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CustomPagination = ({ rowsPerPage, totalPages, currentPage, setRowsPerPage, setCurrentPage }) => {
    return (
        <>
            <Grid container sx={{ px: { xs: 1, sm: 3 }, pb: 2 }} justifyContent="space-between" alignItems="center" mt={2}>
                <Grid>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body2">
                            Rows per page:&nbsp;
                        </Typography>
                        <Select
                            size="small"
                            sx={{
                                border: 'none',
                                boxShadow: 'none',
                                outline: 'none',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-root': {
                                    boxShadow: 'none',
                                    outline: 'none',
                                },
                                '& .MuiSelect-select': {
                                    outline: 'none',
                                },
                            }}
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[5, 10, 15, 20].map((num) => (
                                <MenuItem key={num} value={num}>
                                    {num}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Grid>
                <Grid>
                    <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                        <Typography variant="body2">
                            {currentPage} / {totalPages}
                        </Typography>
                        <IconButton
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            <NavigateBeforeIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            <NavigateNextIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default CustomPagination
