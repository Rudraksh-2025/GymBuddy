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
            <Box sx={{ backgroundColor: "rgb(253, 253, 253)", boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)", mt: 5, padding: 0, borderRadius: '10px' }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ p: { xs: 2 } }}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: { xs: 1, md: 0 } }}>
                        <Typography variant="h6" fontWeight={590} >
                            Food Tracking
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'start', sm: 'end' }, gap: 2 }}>
                        <IconButton
                            className="blue-button"
                            onClick={() => setOpenAddFood(true)}
                        >
                            <AddIcon />
                            Add Food
                        </IconButton>

                    </Grid>
                </Grid>

                {isLoading ? (
                    <Typography align="center" color="text.secondary" sx={{ mt: 1, pb: 2 }}>Loading....</Typography>
                ) : Array.isArray(food?.data) && food?.data?.length > 0 ? (
                    <>
                        <TableContainer >
                            <Table sx={{
                                '& .MuiTableCell-root': {
                                    fontSize: '15px',
                                },
                                '& tbody tr:last-of-type td': {
                                    borderBottom: 'none',
                                },
                            }}>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow >
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787', borderTopLeftRadius: '10px', paddingLeft: '30px' }}>Name</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Calories</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Protein</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Carbs</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Fats</TableCell>
                                        <TableCell sx={{ backgroundColor: '#F9FAFB', color: '#878787' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {food?.data?.map((food) => (
                                        <TableRow key={food._id}>
                                            <TableCell sx={{ paddingLeft: '30px', fontWeight: 500 }}>
                                                {food.name}
                                            </TableCell>
                                            <TableCell sx={{ color: '#878787', paddingLeft: '30px' }}>
                                                {food.calories || '0'} kcal
                                            </TableCell>


                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {food.protein || "0"} gm
                                            </TableCell>
                                            <TableCell sx={{ color: '#878787 ' }}>
                                                {food.carbs || "0"} gm
                                            </TableCell>
                                            <TableCell sx={{ color: '#878787 ' }}>
                                                {food.fats || "0"} gm
                                            </TableCell>
                                            <TableCell>
                                               {
                                                !food.isGlobal&&( <IconButton
                                                    sx={{ color: '#2563EB' }} // blue
                                                    onClick={() => {
                                                        setOpenAddFood(true);
                                                        setSelectedFood(food);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>)
                                               }
                                                <IconButton
                                                    sx={{ color: 'red' }}
                                                    onClick={() => {
                                                        setSelectedFoodId(food._id);
                                                        setName(food.name)
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
                    </>
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ mt: 1, pb: 2 }}>
                        No data found
                    </Typography>
                )}
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
