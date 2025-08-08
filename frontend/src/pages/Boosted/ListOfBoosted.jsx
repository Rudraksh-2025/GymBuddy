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
    Typography,
    Button,
    Pagination, Menu, MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useGetBoostedList } from '../../api/ApiCall';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import axiosInstance from '../../api/axiosInstance'

export default function ListOfBoosted() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetBoostedList(page, 7);
    const Products = data?.marketPlace?.data || [];
    const totalPages = data?.marketPlace?.pagination.totalPages || 1;

    // exports
    const fetchAllProducts = async () => {
        try {
            const response = await axiosInstance.get('/marketplace/bootList/data', {
                params: { page: 1, limit: 10000 }
            });
            return response?.data?.marketPlace?.data || [];
        } catch (error) {
            toast.error('Failed to fetch all Boosted List');
            return [];
        }
    };

    const handleExport = async (type) => {
        const allProducts = await fetchAllProducts();
        if (allProducts.length === 0) {
            toast.warn('No Boosted List available for export');
            return;
        }

        const exportData = allProducts.map((product) => {
            const entry = product?.marketPlace || product?.sublease;
            const isMarketplace = !!product.marketPlace;

            return {
                ID: isMarketplace ? entry?.marketPlace_id ?? 'NA' : entry?.sublease_id ?? 'NA',
                Title: entry?.title ?? 'NA',
                University: entry?.university ?? 'NA',
                Category: entry?.category ?? 'NA',
                Price: entry?.price ?? 'NA',
                purchaseTime: entry?.purchaseTime ?? 'NA',

            };
        });


        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Boot List ');
            XLSX.writeFile(workbook, 'boot_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'boot_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('Boot List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Title', 'University', 'Category', 'Price', 'Status', 'Type']],
                body: allProducts.map(product => {
                    const entry = product?.marketPlace || product?.sublease;
                    const isMarketplace = !!product.marketPlace;
                    return [
                        isMarketplace ? entry?.marketPlace_id ?? 'NA' : entry?.sublease_id ?? 'NA',
                        entry?.title ?? 'NA',
                        entry?.university ?? 'NA',
                        entry?.category ?? 'NA',
                        entry?.price ?? 'NA',
                        entry?.purchaseTime ?? 'NA',
                    ];
                }),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('boot_list.pdf');
        }
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);


    return (
        <Box p={1}>
            {isLoading ? (
                <Typography color="text.secondary" p={1}>Loading Boosted Listings...</Typography>
            ) : isError ? (
                <Typography color="error" p={1}>Error loading Boosted listings.</Typography>) :
                (
                    <Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h3">Boosted Listings</Typography>
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


                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell><strong>ID</strong></TableCell>
                                        <TableCell><strong>Title</strong></TableCell>
                                        <TableCell><strong>University</strong></TableCell>
                                        <TableCell><strong>Category</strong></TableCell>
                                        <TableCell><strong>Price</strong></TableCell>
                                        <TableCell><strong>Purchase Time</strong></TableCell>
                                        <TableCell></TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Products?.length > 0 ? (
                                        Products?.map((product) => {
                                            const entry = product?.marketPlace || product?.sublease;
                                            const isMarketplace = !!product.marketPlace;
                                            return (
                                                <TableRow key={product?.bootList_id}>
                                                    <TableCell>{isMarketplace ? entry?.marketPlace_id : entry?.sublease_id ?? 'NA'}</TableCell>
                                                    <TableCell>{entry?.title ?? 'NA'}</TableCell>
                                                    <TableCell>{entry?.university ?? 'NA'}</TableCell>
                                                    <TableCell>{entry?.category ?? 'NA'}</TableCell>
                                                    <TableCell>{entry?.price ?? 'NA'}</TableCell>
                                                    <TableCell>
                                                        {product?.purchaseTime
                                                            ? new Date(Number(product.purchaseTime)).toLocaleString()
                                                            : 'NA'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isMarketplace ? (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                component={Link}
                                                                to={`/dashboard/products/${entry?.marketPlace_id}`}
                                                            >
                                                                View
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                component={Link}
                                                                to={`/dashboard/sublease/${entry?.sublease_id}`}
                                                            >
                                                                View
                                                            </Button>
                                                        )}
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })
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
                )}
        </Box>
    );
}
