import React, { useState } from "react";
import { Box, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Chip, IconButton } from "@mui/material";
import { useGetCalorieSummary } from '../../Api/Api'
import AddIcon from "@mui/icons-material/Add";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import MacroRing from "../../components/food/MacroRing";

const CalorieTracking = () => {
    const client = useQueryClient()

    const { data: analytics } = useGetCalorieSummary()


    return (
        <Box sx={{ p: { xs: 0, sm: 2 } }}>
            {/* ---------------- ANALYTICS BOX ---------------- */}
            <Grid container spacing={3} mb={5} mt={2}>
                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <MacroRing
                        title="Calories"
                        goal={analytics?.data?.today?.goal?.calories}
                        consumed={analytics?.data?.today?.consumed?.calories}
                        unit="kcal"
                        color="#6366F1"
                    />

                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <MacroRing
                        title="Protein"
                        goal={analytics?.data?.today?.goal?.protein}
                        consumed={analytics?.data?.today?.consumed?.protein}
                        unit="g"
                        color="#22C55E"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <MacroRing
                        title="Carbs"
                        goal={analytics?.data?.today?.goal?.carbs}
                        consumed={analytics?.data?.today?.consumed?.carbs}
                        unit="g"
                        color="#F59E0B"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                    <MacroRing
                        title="Fats"
                        goal={analytics?.data?.today?.goal?.fats}
                        consumed={analytics?.data?.today?.consumed?.fats}
                        unit="g"
                        color="#EF4444"
                    />
                </Grid>
            </Grid>

            {/* ---------------- CHART ---------------- */}
            {/* <Grid size={{ xs: 12, md: 8 }}>
                <WeightChart data={weightData?.data} />
            </Grid> */}

            {/* ---------------- WEIGHT TABLE ---------------- */}
            {/* <Box sx={{ backgroundColor: "rgb(253, 253, 253)", boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)", mt: 5, padding: 0, borderRadius: '10px' }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ p: { xs: 2, md: 3 } }}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: { xs: 1, md: 0 } }}>
                        <Typography variant="h6" fontWeight={590} >
                            Weight Tracking
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'start', sm: 'end' }, gap: 2 }}>

                        <IconButton
                            sx={{
                                border: '1px solid black',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: "#000",
                                width: 150,
                                // "&:hover": { background: "#00b8bf" }
                            }}
                            onClick={() => setOpenAddDialog(true)}
                        >
                            <AddIcon />
                            Add Weight
                        </IconButton>
                    </Grid>
                </Grid>

                {isLoading ? (
                    <Typography align="center" color="text.secondary" sx={{ mt: 1, pb: 2 }}>Loading....</Typography>
                ) : Array.isArray(weightData?.data) && weightData?.data?.length > 0 ? (
                    <>
                        <TableContainer >
                            <Table sx={{ '& .MuiTableCell-root': { fontSize: '15px', } }}>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow >
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787', borderTopLeftRadius: '10px', paddingLeft: '30px' }}>Date</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Day</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Weight</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Weight Change</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {weightData?.data?.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell sx={{ color: '#878787', paddingLeft: '30px' }}>
                                                {FormateDate(user.date) || "-"}
                                            </TableCell>
                                            <TableCell sx={{ color: '#4B5563' }}>
                                                <Chip
                                                    label={getDayFromDate(user.date)}
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        border: '1px solid black',
                                                        '& .MuiChip-label': {
                                                            textTransform: 'capitalize',
                                                            fontWeight: 500,
                                                        }
                                                    }}
                                                />
                                            </TableCell>


                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {user.weight || "-"}
                                            </TableCell>
                                            <TableCell sx={{ color: '#878787 ' }}>
                                                {user.change || "0"} kg
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    sx={{ color: 'red' }}
                                                    onClick={() => {
                                                        setSelectedWeightId(user._id);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>



                        <CustomPagination totalPages={totalPages} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} currentPage={currentPage} />
                    </>
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ mt: 1, pb: 2 }}>
                        No data found
                    </Typography>
                )}
                <AddWeightDialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}

                />
                <DeleteConfirm
                    open={openDelete}
                    title="Delete Weight"
                    content="Are you sure you want to delete this weight entry?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            </Box> */}
        </Box>
    );
};

export default CalorieTracking;
