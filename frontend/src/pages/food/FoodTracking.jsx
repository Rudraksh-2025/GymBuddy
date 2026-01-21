import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, IconButton, Button, TextField, InputAdornment } from "@mui/material";
import { useGetFoods, useDeleteFood } from '../../Api/Api'
import AddIcon from "@mui/icons-material/Add";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddFoodDialog from "../../components/food/AddFoodDialog";
import EditIcon from "@mui/icons-material/Edit";

import search2 from '../../assets/images/search2.svg'
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteConfirm from "../../common/DeleteConfirm2";

const FoodTracking = () => {
  const [openAddFood, setOpenAddFood] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [selectedFood, setSelectedFood] = useState()
  const { data: food, isLoading } = useGetFoods(debouncedSearch)

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
  const handleGlowMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      <Box
        className='glass-container'
        onMouseMove={handleGlowMove}
        sx={{
          mt: 0,
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
            size={{ xs: 12, md: 5 }}
            sx={{ display: "flex", flexDirection: "row", gap: 2, mb: { xs: 1, md: 0 } }}
          >
            <Typography variant="h6" fontWeight={600}>
              Food Tracking
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 2 }}
          >
            <TextField
              variant="outlined"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{
                width: '100%',
                height: '40px',
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  height: '40px',
                  fontSize: '14px',
                  color: 'white'
                },
                '& .MuiOutlinedInput-input': {
                  padding: '10px 14px',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--light-gray)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--light-gray)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--light-gray)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={search2} alt="search icon" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={() => setOpenAddFood(true)}
              startIcon={<AddIcon />}
              className="glass-btn"
              sx={{
                whiteSpace: "nowrap",
                minWidth: "auto",
              }}
            >
              Add Food
            </Button>

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
              <TableContainer
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >

                <Table
                  sx={{
                    backgroundColor: "transparent",
                    "& .MuiTableCell-root": {
                      fontSize: "15px",
                      color: "white",
                      backgroundColor: "transparent",
                    },
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
                              paddingLeft: i === 0 ? "15px" : undefined,
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
                          "&:last-child td, &:last-child th": {
                            borderBottom: "none",
                          },
                          "&:hover": { background: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <TableCell sx={{ paddingLeft: { xs: '10px', sm: '15px' }, padding: 0, fontWeight: 500, minWidth: '100px' }}>
                          {food.name}
                        </TableCell>

                        <TableCell sx={{ opacity: 0.8, minWidth: '70px' }}>
                          {food.calories || "0"} kcal
                        </TableCell>

                        <TableCell sx={{ fontWeight: 500, minWidth: '70px' }}>
                          {food.protein || "0"} gm
                        </TableCell>

                        <TableCell sx={{ opacity: 0.8, minWidth: '70px' }}>
                          {food.carbs || "0"} gm
                        </TableCell>

                        <TableCell sx={{ opacity: 0.8, minWidth: '70px' }}>
                          {food.fats || "0"} gm
                        </TableCell>

                        <TableCell sx={{ minWidth: '70px' }}>
                          {!food.isGlobal && (
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
                            </Box>
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
