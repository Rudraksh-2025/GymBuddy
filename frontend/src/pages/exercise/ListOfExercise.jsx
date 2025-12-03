import { useState } from 'react';
import {
    Box, Typography, Button, Paper, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Select, MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AddExerciseLog from '../../components/exercise/AddExerciseLog';
import AddExercise from '../../components/exercise/AddExercise';
import { useNavigate } from 'react-router-dom';
import { useGetExerciseByMuscle } from '../../api/Api';

const ListOfExercise = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpen2, setDialogOpen2] = useState(false);
    const nav = useNavigate()
    const [muscle, setMuscle] = useState('back')
    const { data: exercises, isLoading, isError } = useGetExerciseByMuscle(muscle);
    return (
        <Box p={1}>
            <Box display="flex" justifyContent={'space-between'} mb={2}>
                <Typography variant="h3" sx={{ color: 'white' }}>Exercise</Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: 'row' }}>
                    <Select
                        value={muscle}
                        onChange={(e) => setMuscle(e.target.value)}
                        sx={{ minWidth: 150, mr: 2 }}
                    >
                        <MenuItem value="back">Back</MenuItem>
                        <MenuItem value="bicep">Bicep</MenuItem>
                        <MenuItem value="chest">Chest</MenuItem>
                        <MenuItem value="tricep">Tricep</MenuItem>
                        <MenuItem value="legs">Legs</MenuItem>
                        <MenuItem value="shoulder">Shoulder</MenuItem>
                    </Select>
                    <Button variant="contained" sx={{ color: 'white' }} startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                        Add Exercise
                    </Button>
                    <Button variant="contained" sx={{ color: 'white' }} startIcon={<Add />} onClick={() => setDialogOpen2(true)}>
                        Add Exercise Log
                    </Button>
                </Box>
                <AddExercise
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        // setEditCategoryData(null);
                    }}
                    muscle={muscle}
                // onSubmit={handleAddCategory}
                // defaultValues={editCategoryData}
                />
                <AddExerciseLog
                    muscle={muscle}
                    open={dialogOpen2}
                    onClose={() => setDialogOpen2(false)}
                />
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 550, overflowY: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Exercise</strong></TableCell>
                            <TableCell><strong>Muscle Group</strong></TableCell>
                            <TableCell><strong>Last Log (Sets)</strong></TableCell>
                            <TableCell><strong>Max Weight</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises?.length > 0 ? (
                            exercises.map((ex) => (
                                <TableRow key={ex._id}>
                                    {/* Exercise Name */}
                                    <TableCell sx={{ fontSize: "1rem" }}>
                                        {ex.exerciseName}
                                    </TableCell>

                                    {/* Muscle Group */}
                                    <TableCell sx={{ fontSize: "1rem", textTransform: "capitalize" }}>
                                        {ex.muscleGroup}
                                    </TableCell>

                                    {/* Last Log (sets) */}
                                    <TableCell>
                                        {ex.lastLog && ex.lastLog.sets?.length > 0 ? (
                                            <Box display="flex" gap={0.5} flexWrap="wrap">
                                                {ex.lastLog.sets.map((s, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={`${s.reps} reps x ${s.weight} kg`} sx={{
                                                            backgroundColor: '#E5E7EB',
                                                            color: '#9CA3AF',
                                                            fontWeight: 500,
                                                            '& .MuiChip-label': {
                                                                textTransform: 'capitalize',
                                                                color: '#6B7280'
                                                            }
                                                        }} size="small" />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No logs yet
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* Max Weight */}
                                    <TableCell>
                                        {ex.maxWeight ? (
                                            <Typography variant="body1" fontWeight="bold">
                                                {ex.maxWeight} kg
                                            </Typography>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Button variant='contained' onClick={() => nav(`/dashboard/exercise-information/${ex._id}`)} sx={{ color: 'white' }}>
                                            View
                                        </Button>
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
        </Box>
    )
}

export default ListOfExercise