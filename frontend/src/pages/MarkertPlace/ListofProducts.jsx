import React, { useState } from 'react';
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Paper,
    TextField,
    Typography,
    Button,
    Pagination, Menu, MenuItem,
    FormControl, InputLabel, Select,
    Switch
} from '@mui/material';
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useMarketPlace, useDeleteMarketPlace, useMarketPlaceStatus } from '../../api/ApiCall';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import DeleteConfirm from '@/common/DeleteConfirm';
import axiosInstance from '../../api/axiosInstance'

export default function ListofProducts() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { data, isLoading, isError } = useMarketPlace(page, 7, search, statusFilter);
    const { mutate: deleteProduct } = useDeleteMarketPlace();
    const { mutate: updateStatus } = useMarketPlaceStatus();

    const Products = data?.marketPlace.data || [];
    const client = useQueryClient()
    const totalPages = data?.marketPlace?.pagination.totalPages || 1;
    if (isLoading) return <div>Loading Market Places...</div>;
    if (isError) return <div>Error loading Market Places.</div>

    const handleDelete = () => {
        if (!selectedId) return;
        deleteProduct(selectedId, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ["marketplaces"], exact: false });
                toast.success("MarketPlace deleted successfully");
                setConfirmOpen(false);
                setSelectedId(null);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
                setConfirmOpen(false);
                setSelectedId(null);
            }
        });
    };

    // status toggle
    const handleStatusToggle = (productId, isChecked) => {
        const newStatus = !isChecked
        updateStatus({ productId, status: newStatus }, {
            onSuccess: () => {
                client.invalidateQueries(['marketplace', productId]);
                toast.success(`MarketPlace Status ${newStatus ? 'Active' : 'Suspended'} `)
            },
            onError: (error) => {
                toast.error(error?.response?.data.message || "something went wrong")
            }
        })
    }

    // exports
    const fetchAllProducts = async () => {
        try {
            const response = await axiosInstance.post('/marketplace', {
                page: 1, limit: 10000
            });
            return response.data?.marketPlace?.data || [];
        } catch (error) {
            toast.error('Failed to fetch all market places');
            return [];
        }
    };

    const handleExport = async (type) => {
        const allProducts = await fetchAllProducts();
        if (allProducts.length === 0) {
            toast.warn('No Market Place available for export');
            return;
        }

        const exportData = allProducts.map((product) => ({
            ID: product?.marketPlace_id ?? 'NA',
            Title: product?.title ?? 'NA',
            University: product?.university ?? 'NA',
            Category: product?.category ?? 'NA',
            Price: product?.price ?? 'NA',
            status: product?.status ? 'Active' : 'suspended',
            Boosted: product?.isbootList ? "Yes" : 'No',
        }));

        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Market Place ');
            XLSX.writeFile(workbook, 'marketPlace_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'marketPlace_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('Market Place List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Title', 'University', 'Category', 'Price', 'Status', 'Boosted']],
                body: allProducts.map(product => [
                    product?.marketPlace_id ?? 'NA',
                    product?.title ?? 'NA',
                    product?.university ?? 'NA',
                    product?.category ?? 'NA',
                    product?.price ?? 'NA',
                    product?.status ? 'Suspended' : 'Active',
                    product?.isbootList ? "Yes" : 'No',
                ]),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('marketPlace_list.pdf');
        }
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);


    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" sx={{
                flexDirection: {
                    xs: 'column', sm: 'row'
                }
            }} mb={2}>
                <Typography variant="h3">Market Place Listing</Typography>
                <Box display={'flex'} flexDirection={'row'} sx={{
                    mt: { xs: 2, sm: 0 },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                }} gap={4}>
                    <Box display="flex" gap={1} >
                        <FormControl sx={{ minWidth: 200 }} size="medium">
                            <InputLabel sx={{
                                backgroundColor: 'transparent !important',
                            }}>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{
                                    '&.Mui-focused': {
                                        boxShadow: 'none',
                                        outline: 'none',
                                    },
                                }}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="sold">Sold</MenuItem>
                                <MenuItem value="removed">Removed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleClick}
                    >
                        Export
                    </Button>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem onClick={() => { handleExport('excel'); handleClose(); }}>Export to Excel</MenuItem>
                        <MenuItem onClick={() => { handleExport('csv'); handleClose(); }}>Export to CSV</MenuItem>
                        <MenuItem onClick={() => { handleExport('pdf'); handleClose(); }}>Export to PDF</MenuItem>

                    </Menu>
                </Box>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by Title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>University</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            {/* <TableCell><strong>Product Status</strong></TableCell> */}
                            <TableCell><strong>Boosted</strong></TableCell>
                            <TableCell><strong>Suspend</strong></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Products?.length > 0 ? (
                            Products?.map((product) => (
                                <TableRow key={product.marketPlace_id}>
                                    <TableCell>{product.marketPlace_id ?? 'NA'}</TableCell>
                                    <TableCell>
                                        {product.title ?? 'NA'}
                                    </TableCell>
                                    <TableCell>{product.university ?? 'NA'}</TableCell>
                                    <TableCell>{product.category ?? 'NA'}</TableCell>
                                    <TableCell>{product.price ?? 'NA'}</TableCell>
                                    <TableCell>{product.isbootList === false ? 'No' : 'Yes'}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={!product?.status}
                                            onChange={(e) => handleStatusToggle(product.marketPlace_id, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" size="small"
                                            component={Link}
                                            to={`/dashboard/products/${product.marketPlace_id}`}
                                            disabled={product.status === false}
                                            sx={{
                                                '&.Mui-disabled': {
                                                    backgroundColor: 'gray',
                                                    color: 'white',
                                                },
                                            }}>
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" size="small" onClick={() => {
                                            setSelectedId(product.marketPlace_id)
                                            setConfirmOpen(true)
                                        }}>
                                            Delete
                                        </Button>
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
            <DeleteConfirm
                open={confirmOpen}
                title="Delete MarketPlace"
                content="Are you sure you want to delete this marketplace?"
                onConfirm={handleDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedId(null);
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
                </Box>}
        </Box>
    );
}
