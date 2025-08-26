import {
    Box, Typography, Button, Paper, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import calender from '../../assets/images/calender.svg'
import { useGetExerciseLogs, useGetExerciseProgress } from '../../api/ApiCall';
import ProgressChart from '../../components/exercise/ProgressChart'; // assuming chart file
import { startOfYear } from "date-fns";
import CustomDateRangePicker from '@/components/CustomDateRangePicker';
const ExerciseInformation = () => {
    const { exerciseId } = useParams();
    const nav = useNavigate();

    const [range, setRange] = useState([
        {
            startDate: startOfYear(new Date()),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const startDate = range[0].startDate.toISOString();
    const endDate = range[0].endDate.toISOString();

    // fetch logs
    const { data: exercises, isLoading, isError } = useGetExerciseLogs(exerciseId);

    // fetch progress with selected date range
    const { data: progress } = useGetExerciseProgress(
        exerciseId,
        startDate,
        endDate
    );

    return (
        <Box p={1}>
            {/* Date Range Filter */}
            <CustomDateRangePicker
                value={range}
                onChange={setRange}
                icon={calender}
            />

            {/* Exercise Logs Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 550, overflowY: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Exercise Log</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises?.length > 0 ? (
                            exercises.map((ex) => (
                                <TableRow key={ex._id}>
                                    <TableCell>
                                        {ex.date ? (
                                            <Typography variant="body1" fontWeight="bold">
                                                {new Date(ex.date).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </Typography>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {ex?.sets && ex?.sets?.length > 0 ? (
                                            <Box display="flex" gap={0.5} flexWrap="wrap">
                                                {ex.sets.map((s, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={`${s.reps} reps x ${s.weight} kg`}
                                                        sx={{
                                                            backgroundColor: '#E5E7EB',
                                                            color: '#9CA3AF',
                                                            fontWeight: 500,
                                                            '& .MuiChip-label': {
                                                                textTransform: 'capitalize',
                                                                color: '#6B7280'
                                                            }
                                                        }}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No logs yet
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No Exercises Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Progress Chart */}
            {progress && progress.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6" mb={2}>
                        Progress Over Time
                    </Typography>
                    <ProgressChart progress={progress} />
                </Box>
            )}
        </Box>
    );
};

export default ExerciseInformation;
