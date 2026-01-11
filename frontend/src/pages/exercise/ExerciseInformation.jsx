import {
    Box, Typography, Button, Paper, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import calender from '../../assets/images/calender.svg'
import { useGetExerciseLogs, useGetExerciseProgress } from '../../Api/Api';
import ProgressChart from '../../components/exercise/ProgressChart';
import { startOfYear } from "date-fns";
import CustomDateRangePicker from '../../common/custom/CustomDateRangePicker';
const ExerciseInformation = () => {
    const { id: exerciseId } = useParams();
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
    const { data: exercises, isLoading, isError } = useGetExerciseLogs(exerciseId, startDate,
        endDate);

    // fetch progress with selected date range
    const { data: progress } = useGetExerciseProgress(
        exerciseId,
        startDate,
        endDate
    );

    return (
        <Box p={1}>
            {/* Date Range Filter */}
            <Box>
                <CustomDateRangePicker
                    value={range}
                    onChange={setRange}
                    icon={calender}
                />
            </Box>

            {/* Exercise Logs Table */}
          <TableContainer
  sx={{
    mt: 2,
    borderRadius: "20px",
    overflow: "hidden",

    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.18)",

    boxShadow: `
      inset 0 0 0.5px rgba(255,255,255,0.6),
      0 12px 40px rgba(0,0,0,0.45)
    `,
  }}
>
     <Table
    stickyHeader
    sx={{
      "& .MuiTableCell-root": {
        fontSize: "14px",
        color: "white",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      },
      "& tbody tr:last-of-type td": {
        borderBottom: "none",
      },
    }}
  >
    {/* HEADER */}
    <TableHead>
      <TableRow
        sx={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <TableCell sx={{ fontWeight: 600, paddingLeft: "30px", color: "rgba(255,255,255,0.7)", background: "transparent", }}>
          Date
        </TableCell>
        <TableCell sx={{ fontWeight: 600, background: "transparent", color: "rgba(255,255,255,0.7)" }}>
          Exercise Log
        </TableCell>
      </TableRow>
    </TableHead>


    {/* BODY */}
    <TableBody>
      {exercises?.length > 0 ? (
        exercises.map((ex) => (
          <TableRow
            key={ex._id}
            sx={{
              "&:hover": { background: "rgba(255,255,255,0.05)" },
            }}
          >
            <TableCell sx={{ paddingLeft: "30px", fontWeight: 600 }}>
              {ex.date
                ? new Date(ex.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
            </TableCell>

            <TableCell>
              {ex?.sets && ex.sets.length > 0 ? (
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {ex.sets.map((s, i) => (
                    <Chip
                      key={i}
                      label={`${s.reps} reps x ${s.weight} kg`}
                      size="small"
                      sx={{
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "white",
                        "& .MuiChip-label": { fontWeight: 500 },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  No logs yet
                </Typography>
              )}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={2} align="center" sx={{ py: 3, opacity: 0.7 }}>
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
                    <Typography variant="h6" sx={{ color: 'white' }} mb={2}>
                        Progress Over Time
                    </Typography>
                    <ProgressChart progress={progress} />
                </Box>
            )}
        </Box>
    );
};

export default ExerciseInformation;