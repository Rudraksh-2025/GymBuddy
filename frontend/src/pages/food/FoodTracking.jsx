import React, { useState } from "react";
import { Box, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, IconButton } from "@mui/material";
import { useGetFoods, useDeleteFood } from '../../Api/Api'
import AddIcon from "@mui/icons-material/Add";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddFoodDialog from "../../components/food/AddFoodDialog";
import EditIcon from "@mui/icons-material/Edit";


import DeleteIcon from "@mui/icons-material/Delete";

import DeleteConfirm from "../../common/DeleteConfirm2";

const FoodTracking = () => {
  const [openAddFood, setOpenAddFood] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [name, setName] = useState('')
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [selectedFood, setSelectedFood] = useState()
  const { data: food, isLoading } = useGetFoods()
  const { mutate: deleteFood } = useDeleteFood()

  const client = useQueryClient()

  const handleDeleteConfirm = () => {
    if (!selectedFoodId) return;

    deleteFood(selectedFoodId, {
      onSuccess: () => {
        setOpenDelete(false);
        setSelectedFoodId(null);
        toast.success("Food deleted successfully")
        client.invalidateQueries(['foodList'], { exact: false })
      },
      onError: (err) => {
        setOpenDelete(false);
        toast.error(err?.response?.data?.message || "Something went wrong");

      }
    });
  };
  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setSelectedFoodId(null);
  };
  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      <Box
        className="glass-container"
        sx={{
          mt: 5,
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          color: "white",
        }}
      >
        {/* glossy highlight */}
        <Box
          className='glass-layer'
        />

        {/* Header */}
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: { xs: 2 }, position: "relative", zIndex: 1 }}
        >
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ display: "flex", flexDirection: "row", gap: 2, mb: { xs: 1, md: 0 } }}
          >
            <Typography variant="h6" fontWeight={600}>
              Food Tracking
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}
          >
            <IconButton
              onClick={() => setOpenAddFood(true)}
              className="glass-btn"
            >
              <AddIcon sx={{ mr: 0.5 }} />
              Add Food
            </IconButton>
          </Grid>
        </Grid>

        {/* CONTENT */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {isLoading ? (
            <Typography align="center" sx={{ mt: 1, pb: 2, opacity: 0.7 }}>
              Loading...
            </Typography>
          ) : Array.isArray(food?.data) && food?.data?.length > 0 ? (
            <>
              <TableContainer>
                <Table
                  sx={{
                    "& .MuiTableCell-root": { fontSize: "15px", color: "white" },
                    "& tbody tr:last-of-type td": { borderBottom: "none" },
                  }}
                >
                  {/* Glass Header */}
                  <TableHead>
                    <TableRow
                      sx={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {["Name", "Calories", "Protein", "Carbs", "Fats", "Action"].map(
                        (h, i) => (
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
                        )
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {food?.data?.map((food) => (
                      <TableRow
                        key={food._id}
                        sx={{
                          "&:hover": { background: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <TableCell sx={{ paddingLeft: "30px", fontWeight: 500 }}>
                          {food.name}
                        </TableCell>

                        <TableCell sx={{ opacity: 0.8 }}>
                          {food.calories || "0"} kcal
                        </TableCell>

                        <TableCell sx={{ fontWeight: 500 }}>
                          {food.protein || "0"} gm
                        </TableCell>

                        <TableCell sx={{ opacity: 0.8 }}>
                          {food.carbs || "0"} gm
                        </TableCell>

                        <TableCell sx={{ opacity: 0.8 }}>
                          {food.fats || "0"} gm
                        </TableCell>

                        <TableCell>
                          {!food.isGlobal && (
                            <>
                              <IconButton
                                sx={{
                                  color: "#60A5FA",
                                  "&:hover": { background: "rgba(96,165,250,0.15)" },
                                }}
                                onClick={() => {
                                  setOpenAddFood(true);
                                  setSelectedFood(food);
                                }}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                sx={{
                                  color: "#F87171",
                                  "&:hover": { background: "rgba(248,113,113,0.15)" },
                                }}
                                onClick={() => {
                                  setSelectedFoodId(food._id);
                                  setName(food.name);
                                  setOpenDelete(true);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography align="center" sx={{ mt: 1, pb: 2, opacity: 0.7 }}>
              No data found
            </Typography>
          )}
        </Box>

        {/* Dialogs remain same */}
        <AddFoodDialog
          open={openAddFood}
          onClose={() => setOpenAddFood(false)}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
        />

        <DeleteConfirm
          open={openDelete}
          title="Delete Food"
          content={`Are you sure you want to delete ${name}'s entry?`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </Box>

    </Box>
  );
};

export default FoodTracking;
