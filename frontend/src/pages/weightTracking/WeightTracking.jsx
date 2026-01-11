import React, { useState } from "react";
import { Box, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Chip, IconButton } from "@mui/material";
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
import FlagIcon from "@mui/icons-material/Flag";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import StatCard from "../../components/StatCard";

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
                <Typography variant="body2" sx={{ color: '#878787' }}>&nbsp;vs last week</Typography>
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
  {/* Target Weight */}
  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
    <StatCard
      title="Target Weight"
      value={`${analytics?.data?.targetWeight?.value ?? 0} kg`}
      sub="Goal weight"
      icon={<FlagIcon sx={{ color: "white" }} />}
      color="#16A34A"
    />
  </Grid>

  {/* Weight Left */}
  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
    <StatCard
      title="Weight Left"
      value={`${analytics?.data?.weightLeft?.value ?? 0} kg`}
      sub={
        <PercentageChange
          flag={analytics?.data?.weightLeft?.change?.flag}
          value={analytics?.data?.weightLeft?.change?.percentage}
        />
      }
      icon={<MonitorWeightIcon sx={{ color: "white" }} />}
      color="#F59E0B"
    />
  </Grid>

  {/* Total Weight Lost */}
  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
    <StatCard
      title="Total Lost"
      value={`${analytics?.data?.totalLost?.value ?? 0} kg`}
      sub={
        <PercentageChange
          flag={analytics?.data?.totalLost?.change?.flag}
          value={analytics?.data?.totalLost?.change?.percentage}
        />
      }
      icon={<TrendingDownIcon sx={{ color: "white" }} />}
      color="#EF4444"
    />
  </Grid>

  {/* Body Fat % */}
  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
    <StatCard
      title="Body Fat"
      value={`${analytics?.data?.bodyFat?.value ?? 0}%`}
      sub={
        <PercentageChange
          flag={analytics?.data?.bodyFat?.change?.flag}
          value={analytics?.data?.bodyFat?.change?.percentage}
        />
      }
      icon={<FitnessCenterIcon sx={{ color: "white" }} />}
      color="#8B5CF6"
    />
  </Grid>
</Grid>


            {/* ---------------- CHART ---------------- */}
            <Grid size={{ xs: 12, md: 8 }}>
                <WeightChart data={weightData?.data} />
            </Grid>

            {/* ---------------- WEIGHT TABLE ---------------- */}
            <Box
  sx={{
    mt: 5,
    borderRadius: "20px",
    position: "relative",
    overflow: "hidden",

    /* Glass surface */
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.18)",

    boxShadow: `
      inset 0 0 0.5px rgba(255,255,255,0.6),
      0 12px 40px rgba(0,0,0,0.45)
    `,
    color: "white",
  }}
>
  {/* glossy highlight */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 60%)",
      pointerEvents: "none",
    }}
  />

  {/* Header */}
  <Grid
    container
    justifyContent="space-between"
    alignItems="center"
    sx={{ p: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}
  >
    <Grid
      size={{ xs: 12, sm: 6 }}
      sx={{ display: "flex", flexDirection: "row", gap: 2, mb: { xs: 1, md: 0 } }}
    >
      <Typography variant="h6" fontWeight={600}>
        Weight Tracking
      </Typography>
    </Grid>

    <Grid
      size={{ xs: 12, sm: 6 }}
      sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}
    >
      <IconButton
        className="glass-btn"
        onClick={() => setOpenAddDialog(true)}
      >
        <AddIcon sx={{ mr: 0.5 }} />
        Add Weight
      </IconButton>
    </Grid>
  </Grid>

  {/* CONTENT */}
  <Box sx={{ position: "relative", zIndex: 1 }}>
    {isLoading ? (
      <Typography align="center" sx={{ mt: 1, pb: 2, opacity: 0.7 }}>
        Loading...
      </Typography>
    ) : Array.isArray(weightData?.data) && weightData?.data?.length > 0 ? (
      <>
        <TableContainer>
          <Table sx={{ "& .MuiTableCell-root": { fontSize: "14px", color: "white" } }}>
            {/* Glass Header */}
            <TableHead>
              <TableRow
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {["Date", "Day", "Weight", "Weight Change", ""].map((h, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                      paddingLeft: i === 0 ? "30px" : undefined,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {weightData?.data?.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    "&:hover": {
                      background: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <TableCell sx={{ paddingLeft: "30px", opacity: 0.8 }}>
                    {FormateDate(user.date) || "-"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getDayFromDate(user.date)}
                      sx={{
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "white",
                        "& .MuiChip-label": {
                          textTransform: "capitalize",
                          fontWeight: 500,
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 500 }}>
                    {user.weight || "-"}
                  </TableCell>

                  <TableCell sx={{ opacity: 0.8 }}>
                    {user.change || "0"} kg
                  </TableCell>

                  <TableCell>
                    <IconButton
                      sx={{
                        color: "#F87171",
                        "&:hover": { background: "rgba(248,113,113,0.15)" },
                      }}
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

        <CustomPagination
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
        />
      </>
    ) : (
      <Typography align="center" sx={{ mt: 1, pb: 2, opacity: 0.7 }}>
        No data found
      </Typography>
    )}
  </Box>

  {/* Dialogs stay same */}
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
