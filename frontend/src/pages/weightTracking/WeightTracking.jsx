import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Card, TableContainer, Chip, IconButton, Button
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FormateDate } from '../../utils/FormateDate'
import { useDeleteWeight, useGetWeightMetrices, useGetWeightLogs } from '../../Api/Api'
import CustomPagination from '../../common/custom/CustomPagination'
import DeleteIcon from "@mui/icons-material/Delete";
import WeightChart from "../../components/weight/WeightChart";
import AddIcon from "@mui/icons-material/Add";
import AddWeightDialog from "../../components/weight/AddWeightDialog";
import DeleteConfirm from "../../common/DeleteConfirm2";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";



const WeightTracking = () => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedWeightId, setSelectedWeightId] = useState(null);

    const client = useQueryClient()

    const PercentageChange = ({ flag, value }) => {
        const isUp = flag === 'up';
        return (
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: isUp ? '#16A34A' : 'red', fontWeight: 500 }}>
                {isUp ? (
                    <ArrowUpward sx={{ color: '#16A34A', fontSize: 18, mr: 0.3 }} />
                ) : (
                    <ArrowDownward sx={{ color: 'red', fontSize: 18, mr: 0.3 }} />
                )}
                {value || 0}%
                <Typography variant="body2" sx={{ color: '#878787' }}>&nbsp;vs last month</Typography>
            </Box>
        );
    };
    const { data: analytics } = useGetWeightMetrices()
    const { data: weightData, isLoading } = useGetWeightLogs()
    const { mutate: deleteWeight } = useDeleteWeight();


    const totalUsers = weightData?.pagination?.totalCount;
    const totalPages = Math.ceil(totalUsers / rowsPerPage);

    const handleDeleteConfirm = () => {
        if (!selectedWeightId) return;

        deleteWeight(selectedWeightId, {
            onSuccess: () => {
                setOpenDelete(false);
                setSelectedWeightId(null);
                toast.success("Weight Log deleted successfully")
                client.invalidateQueries(['weight'], { exact: false })
            },
            onError: (err) => {
                setOpenDelete(false);
                toast.error(err?.response?.data?.message || "Something went wrong");

            }
        });
    };
    const handleDeleteCancel = () => {
        setOpenDelete(false);
        setSelectedWeightId(null);
    };


    const getDayFromDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
        });
    };


    return (
        <Box sx={{ p: { xs: 0, sm: 2 } }}>
            {/* ---------------- ANALYTICS BOX ---------------- */}
            <Grid container spacing={3} mb={5}>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#ECFDF5', borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Target Weight</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {analytics?.data?.targetWeight?.value ?? 0} kg
                                </Typography>
                                <PercentageChange
                                    flag={analytics?.data?.targetWeight?.change?.flag}
                                    value={analytics?.data?.targetWeight?.change?.percentage}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#FFF7ED', borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Weight Left</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {analytics?.data?.weightLeft?.value ?? 0} kg
                                </Typography>
                                <PercentageChange
                                    flag={analytics?.data?.weightLeft?.change?.flag}
                                    value={analytics?.data?.weightLeft?.change?.percentage}
                                />

                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#FEF2F2', borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Total Weight Lost</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    {analytics?.data?.totalLost?.value ?? 0} kg
                                </Typography>

                                <PercentageChange
                                    flag={analytics?.data?.totalLost?.change?.flag}
                                    value={analytics?.data?.totalLost?.change?.percentage}
                                />

                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#F5F3FF', borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Body Fat %</Typography>
                                <Typography variant="h4" fontWeight={600}>{analytics?.data?.bodyFat?.value || 0}%</Typography>
                                <PercentageChange
                                    flag={analytics?.data?.bodyFat?.change?.flag}
                                    value={analytics?.data?.bodyFat?.change?.percentage}
                                />

                            </Box>

                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* ---------------- CHART ---------------- */}
            <Grid size={{ xs: 12, md: 8 }}>
                <WeightChart data={weightData?.data} />
            </Grid>

            {/* ---------------- WEIGHT TABLE ---------------- */}
            <Box sx={{ backgroundColor: "rgb(253, 253, 253)", boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)", mt: 5, padding: 0, borderRadius: '10px' }}>
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
                                        <TableRow key={user.id}>
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
            </Box>
        </Box>
    );
};

export default WeightTracking;
