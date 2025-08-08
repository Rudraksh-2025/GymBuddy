import { useState } from 'react';
import {
    Box, Typography, Button, Paper, Chip,
    Pagination,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Tooltip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AddCategory from './AddCategory';
import { useCategory, useDeleteCategory } from '@/api/ApiCall';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import DeleteConfirm from '@/common/DeleteConfirm';
const Category = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [editCategoryData, setEditCategoryData] = useState(null);
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useCategory(page, 6, search);

    const { mutate: deleteCategory } = useDeleteCategory(
        () => {
            queryClient.invalidateQueries({ queryKey: ["categories"], exact: false });
            toast.success("Category deleted successfully");
        },
        (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    );
    const confirmDelete = () => {
        if (selectedCat) {
            handleDeleteCategory(selectedCat);
            setConfirmOpen(false);
            setSelectedCat(null);
        }
    };
    const categoryList = (data?.productCategory?.data || [])
        .map(cat => ({
            ...cat,
            subCategories: cat.subCatName || {}
        }));
    const totalPages = data?.productCategory?.pagination.totalPages || 1;
    const handleAddCategory = (newCategory) => {
        setEditCategoryData(null);
    };


    const handleDeleteCategory = (catObj) => {
        deleteCategory(catObj.productCategory_id);
    };
    const handleEditClick = (categoryData) => {
        setEditCategoryData(categoryData);
        setDialogOpen(true);
    };
    if (isLoading) return <div>Loading Categories...</div>;
    if (isError) return <div>Error loading Categories.</div>
    return (
        <Box p={1}>
            <Box display="flex" justifyContent={'space-between'} mb={2}>
                <Typography variant="h3">Category</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                    Add Category
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{
                maxHeight: { xs: 600, sm: 550 },
                overflowY: 'auto'
            }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Subcategories</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryList.length > 0 ? (
                            categoryList.map((catObj) => (
                                <TableRow key={catObj.productCategory_id}>
                                    <TableCell sx={{ fontSize: '1rem' }}>{catObj.name}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem' }}> {catObj.type}</TableCell>
                                    <TableCell>
                                        {/* Subcategories with sizes */}
                                        {Object.entries(catObj.subCategories || {}).map(([subCat, sizes], idx) => (
                                            Array.isArray(sizes) && sizes.length > 0 && (
                                                <Box key={idx} mb={1}>
                                                    <Typography variant="body1" fontWeight="bold">{subCat}:</Typography>
                                                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                                                        {sizes.map((sz, i) => (
                                                            <Chip key={i} size="small" label={sz} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )
                                        ))}

                                        {/* Subcategories without sizes in a single line */}
                                        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                                            {Object.entries(catObj.subCategories || {}).map(([subCat, sizes], idx) => (
                                                (!Array.isArray(sizes) || sizes.length === 0) && (
                                                    <Chip variant='outlined' key={idx} label={subCat} size="small" />
                                                )
                                            ))}
                                        </Box>
                                    </TableCell>


                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton color="secondary" onClick={() => handleEditClick(catObj)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => {
                                                setSelectedCat(catObj);
                                                setConfirmOpen(true);
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={12} align="center">
                                    No Data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddCategory
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditCategoryData(null);
                }}
                onSubmit={handleAddCategory}
                defaultValues={editCategoryData}
            />
            <DeleteConfirm
                open={confirmOpen}
                title="Delete Category"
                content="Are you sure you want to delete this category?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedCatId(null);
                }}
            />
            {totalPages > 1 &&
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            }
        </Box>
    );
};

export default Category;
