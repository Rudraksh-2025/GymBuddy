// Transaction Table.jsx
import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Pagination, Menu, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query'
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { useGetTransaction } from '../../api/ApiCall';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import axiosInstance from '../../api/axiosInstance'

export default function ListOfTransactions() {
    const [anchorEl, setAnchorEl] = useState(null);
    const queryClient = useQueryClient();
    const open = Boolean(anchorEl);
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderByfilter, setOrderByFilter] = useState('desc');
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, isFetching } = useGetTransaction(page, 10000, statusFilter, orderByfilter);
    const Transaction = data?.data || [];
    useEffect(() => {
        if (orderByfilter) {
            queryClient.invalidateQueries({
                queryKey: ['transaction', page, 10, statusFilter, orderByfilter],
            });
        }
    }, [orderByfilter, page, statusFilter, queryClient]);

    // const totalPages = data?.data?.pagination.totalPages || 1;
    // exports
    const fetchAllTransactions = async () => {
        try {
            const response = await axiosInstance.get('/payment/getAllTransction', {
                params: {
                    page: 1,
                    limit: 10000,
                    status: statusFilter,
                    orderBy: orderByfilter
                }
            });
            return response.data?.data || [];
        } catch (error) {
            toast.error('Failed to fetch all transactions');
            return [];
        }
    };


    const handleExport = async (type) => {
        const allTransaction = await fetchAllTransactions();
        if (allTransaction.length === 0) {
            toast.warn('No Transactions available for export');
            return;
        }

        const exportData = allTransaction.map((txn) => ({
            ID: txn?.id ?? 'NA',
            Amount: `$${txn.amount / 100}` ?? 'NA',
            Status: txn?.status ?? 'NA',
            Paid: txn.paid ? 'Yes' : 'No',
            Refunded_Amount: `$${txn.amount_refunded / 100}` ?? 'NA',
            Buyer_Name: txn.billing_details?.name ?? 'NA',
            Created: new Date(txn.created * 1000).toLocaleString()
        }));

        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaction');
            XLSX.writeFile(workbook, 'Transaction_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'transaction_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('Transaction List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Amount', 'Status', 'Paid', 'Refunded Amount', 'Buyer Name', 'Created']],
                body: allTransaction.map(txn => [
                    txn?.id ?? 'NA',
                    `$${txn.amount / 100}` ?? 'NA',
                    txn?.status ?? 'NA',
                    txn.paid ? 'Yes' : 'No',
                    `$${txn.amount_refunded / 100}` ?? 'NA',
                    txn.billing_details?.name ?? 'NA',
                    new Date(txn.created * 1000).toLocaleString()
                ]),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('Transaction_list.pdf');
        }
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Box p={1}>
            {isLoading ? (
                <Typography color="text.secondary" p={1}>Loading Transaction data...</Typography>
            ) : isError ? (
                <Typography color="error" p={1}>Error loading Transaction listings.</Typography>) :
                (<Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h3">Transaction Listing</Typography>
                        <Box display={'flex'} flexDirection={'row'} sx={{
                            mt: { xs: 2, sm: 0 },
                            justifyContent: { xs: 'space-between', sm: 'flex-start' }
                        }} gap={4}>
                            <Box display="flex" gap={1} >
                                <FormControl sx={{ minWidth: 200 }} size="medium">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Status"
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="succeeded">Success</MenuItem>
                                        <MenuItem value="refunded">Refunded</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 200 }} size="medium">
                                    <InputLabel>Order By</InputLabel>
                                    <Select
                                        value={orderByfilter}
                                        label="Order By"
                                        onChange={(e) => setOrderByFilter(e.target.value)}
                                    >
                                        <MenuItem value="desc">Descending</MenuItem>
                                        <MenuItem value="asc">Ascending</MenuItem>
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
                    {/* <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by Title, university"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ mb: 2 }}
                    /> */}

                    <TableContainer component={Paper}
                        sx={{
                            maxHeight: { xs: 600, sm: 550 },
                            overflowY: 'auto'
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow >
                                    <TableCell><strong >Transaction ID</strong></TableCell>
                                    <TableCell><strong>Amount (USD)</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>

                                    <TableCell><strong>Paid</strong></TableCell>
                                    <TableCell><strong>Refunded Amount</strong></TableCell>

                                    {/* <TableCell><strong>Payment Method</strong></TableCell> */}
                                    <TableCell><strong>Buyer Name</strong></TableCell>
                                    <TableCell><strong>Created</strong></TableCell>

                                    <TableCell><strong>Receipt</strong></TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isFetching ? (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">
                                            <Typography color="text.secondary" p={1}>Loading Transaction data...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    (
                                        Transaction && Transaction.length > 0 ? (
                                            Transaction.map((txn) => (
                                                <TableRow key={txn.id}>
                                                    <TableCell>{txn.id}</TableCell>
                                                    <TableCell>{`$${txn.amount / 100}`}</TableCell>
                                                    <TableCell>{txn.status}</TableCell>
                                                    <TableCell>{txn.paid ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell>{`$${txn.amount_refunded / 100}`}</TableCell>
                                                    {/* <TableCell>{txn.payment_method_details?.card?.brand ?? 'NA'} ****{txn.payment_method_details?.card?.last4 ?? 'NA'}</TableCell> */}
                                                    <TableCell>{txn.billing_details?.name ?? 'NA'}</TableCell>
                                                    <TableCell>{new Date(txn.created * 1000).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="secondary" size="small"
                                                            target='_blank'
                                                            component={Link}
                                                            to={txn.receipt_url}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )
                                            : (
                                                <TableRow>
                                                    <TableCell colSpan={12} align="center">
                                                        No Data found.
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box> */}
                </Box>)
            }
        </Box>
    );
}
