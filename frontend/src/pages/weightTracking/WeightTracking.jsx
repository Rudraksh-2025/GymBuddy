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
import CustomPagination from '../../common/custom/CustomPagination'
import DeleteIcon from "@mui/icons-material/Delete";
import WeightChart from "../../components/weight/WeightChart";
import AddIcon from "@mui/icons-material/Add";
import AddWeightDialog from "../../components/weight/AddWeightDialog";

const weightData = {
    targetWeight: 66,
    weightLeft: 1.8,
    bodyFat: 19.79,
    totalLost: 2.30,
    waist: 32,
    neck: 13,
    data: [
        { date: "11/12/2025", day: "Wednesday", weight: 70.10, change: 0 },
        { date: "11/27/2025", day: "Thursday", weight: 69.30, change: -0.80 },
        { date: "11/28/2025", day: "Friday", weight: 69.15, change: -0.15 },
        { date: "11/29/2025", day: "Sataurday", weight: 68.95, change: -0.20 },
        { date: "12/3/2025", day: "Wednesday", weight: 69.55, change: 0.60 },
        { date: "12/4/2025", day: "Thursday", weight: 68.65, change: -0.90 },
        { date: "12/6/2025", day: "Saturday", weight: 68.00, change: -0.65 },
        { date: "12/8/2025", day: "Monday", weight: 68.45, change: 0.45 },
        { date: "12/10/2025", day: "Wednesday", weight: 67.85, change: -0.60 },
        { date: "12/11/2025", day: "Thursday", weight: 67.45, change: -0.40 },
        { date: "12/12/2025", day: "Friday", weight: 67.80, change: 0.35 },
    ],
    pagination: {
        "currentPage": 1,
        "totalPages": 1,
        "totalCount": 11
    }
}


const WeightTracking = () => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const PercentageChange = ({ flag, value }) => {
        const isUp = flag === 'up';
        return (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', color: isUp ? '#16A34A' : 'red', fontWeight: 500 }}>
                {isUp ? (
                    <ArrowUpward sx={{ color: '#16A34A', fontSize: 18, mr: 0.3 }} />
                ) : (
                    <ArrowDownward sx={{ color: 'red', fontSize: 18, mr: 0.3 }} />
                )}
                {value || 0}%
                <Typography sx={{ color: '#878787' }}>&nbsp;vs last month</Typography>
            </Box>
        );
    };
    const isLoading = false

    const totalUsers = WeightTracking?.pagination?.totalCount;
    const totalPages = Math.ceil(totalUsers / rowsPerPage);

    const handleAddWeight = (newEntry) => {
        // append at top OR push into array
        weightData.data.push(newEntry);

        // trigger re-render if data will later come from API
        setCurrentPage(1);
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
                                    {weightData.targetWeight ?? 0} kg
                                </Typography>
                                <PercentageChange
                                    flag={'up'}
                                    value={23}
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
                                    {weightData?.weightLeft ?? 0} kg
                                </Typography>
                                <PercentageChange
                                    flag={'down'}
                                    value={20}
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
                                    {weightData?.totalLost ?? 0} kg
                                </Typography>

                                <PercentageChange
                                    flag={'up'}
                                    value={5.4}
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
                                <Typography variant="h4" fontWeight={600}>{weightData?.bodyFat || 0}%</Typography>
                                <PercentageChange
                                    flag={'down'}
                                    value={2}
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
                                "&:hover": { background: "#00b8bf" }
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
                                                    label={user.day}
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
                                                {user.change || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton sx={{ color: 'red' }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <AddWeightDialog
                            open={openAddDialog}
                            onClose={() => setOpenAddDialog(false)}
                            onSave={handleAddWeight}
                            lastWeight={weightData?.data?.[weightData.data.length - 1]?.weight}
                        />

                        <CustomPagination totalPages={totalPages} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} currentPage={currentPage} />
                    </>
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ mt: 1, pb: 2 }}>
                        No data found
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default WeightTracking;
