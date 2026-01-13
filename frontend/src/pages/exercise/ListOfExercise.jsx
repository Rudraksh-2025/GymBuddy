import { useState } from "react";
import { Box, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import AddExerciseLog from "../../components/exercise/AddExerciseLog";
import AddExercise from "../../components/exercise/AddExercise";
import { useNavigate } from "react-router-dom";
import { useGetExerciseByMuscle } from "../../Api/Api";

const ListOfExercise = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const nav = useNavigate();
  const [muscle, setMuscle] = useState("back");
  const { data: exercises } = useGetExerciseByMuscle(muscle);
  return (
    <Box sx={{ p: { xs: 0, sm: 1 } }}>
      <Box
        display="flex"
        sx={{ flexDirection: { xs: "column", lg: "row" } }}
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
          Exercise Library
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            mt: { xs: 2, lg: 0 },
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          {/* Muscle Select — Glass */}
          <Select
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            variant="outlined"
            sx={{
              minWidth: 160,
              height: "50px",
              color: "white",
              borderRadius: "12px",

              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",

              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover": { background: "rgba(255,255,255,0.18)" },

              "& .MuiSelect-icon": { color: "white" },

              "& .MuiSelect-select": {
                height: "50px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "14px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: "rgba(20,20,30,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                },
              },
            }}
          >
            <MenuItem value="back">Back</MenuItem>
            <MenuItem value="bicep">Bicep</MenuItem>
            <MenuItem value="chest">Chest</MenuItem>
            <MenuItem value="tricep">Tricep</MenuItem>
            <MenuItem value="legs">Legs</MenuItem>
            <MenuItem value="shoulder">Shoulder</MenuItem>
          </Select>

          {/* Action Buttons — Glass */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: 'space-between' } }}>
            <Button
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
              sx={{
                height: "50px",
                px: 2,
              }}
              className="glass-btn"
            >
              Add Exercise
            </Button>

            <Button
              startIcon={<Add />}
              onClick={() => setDialogOpen2(true)}
              sx={{
                height: "50px",
                px: 2,
              }}
              className="glass-btn"
            >
              Add Exercise Log
            </Button>
          </Box>
        </Box>
        <AddExercise open={dialogOpen} onClose={() => { setDialogOpen(false); }} muscle={muscle} />
        <AddExerciseLog muscle={muscle} open={dialogOpen2} onClose={() => setDialogOpen2(false)} />
      </Box>

      <TableContainer
        sx={{
          borderRadius: "16px",

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
          {/* HEADER — SAME AS FOOD / WEIGHT TABLE */}
          <TableHead>
            <TableRow
              sx={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              {[
                "Exercise",
                "Muscle Group",
                "Last Log (Sets)",
                "Max Weight",
                "Action",
              ].map((h, i) => (
                <TableCell
                  key={i}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 600,
                    background: "transparent",
                    paddingLeft: i === 0 ? "30px" : undefined,
                  }}
                >
                  {h}
                </TableCell>
              ))}
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
                  <TableCell sx={{ paddingLeft: "30px", fontWeight: 500 }}>
                    {ex.exerciseName}
                  </TableCell>

                  <TableCell sx={{ textTransform: "capitalize", opacity: 0.85 }}>
                    {ex.muscleGroup}
                  </TableCell>

                  <TableCell>
                    {ex.lastLog && ex.lastLog.sets?.length > 0 ? (
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {ex.lastLog.sets.map((s, i) => (
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

                  <TableCell sx={{ fontWeight: 600 }}>
                    {ex.maxWeight ? `${ex.maxWeight} kg` : "-"}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        nav(`/home/exercise/exercise-information/${ex._id}`)
                      }
                      sx={{ height: '38px' }}
                      className="purple-glosy-btn"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, opacity: 0.7 }}>
                  No Exercises Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default ListOfExercise;
