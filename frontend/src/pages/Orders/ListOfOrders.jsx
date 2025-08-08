import { useState, useEffect } from 'react';
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
    Pagination, Menu, MenuItem,
    FormControl, InputLabel, Select
} from '@mui/material';
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useGetOrders } from '../../api/ApiCall';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import axiosInstance from '../../api/axiosInstance'

export default function ListOfOrders() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Sold');
    const [typeFilter, setTypeFilter] = useState('buzzi');
    const [page, setPage] = useState(1);
    const open = Boolean(anchorEl);
    const client = useQueryClient()
    const { data, isLoading, isError } = useGetOrders(page, 7, statusFilter, typeFilter);
    const Orders = data?.order?.data || []
    const totalPages = data?.order?.pagination?.totalPages
    // exports
    const fetchAllOrders = async () => {
        try {
            const response = await axiosInstance.get('/order/getOrderByStatus/', {
                params: {
                    page: 1,
                    limit: 10000,
                    status: statusFilter,
                    type: typeFilter,
                }
            });
            return response.data?.order?.data || [];
        } catch (error) {
            toast.error('Failed to fetch all Orders');
            return [];
        }
    };


    const handleExport = async (type) => {
        const allOrders = await fetchAllOrders();
        if (allOrders.length === 0) {
            toast.warn('No orders available for export');
            return;
        }

        const exportData = allOrders.map((order) => ({
            ID: order?.sell_id ?? 'NA',
            Title: order?.marketPlace?.title ?? 'NA',
            MarketPlaceId: order?.marketPlace?.marketPlace_id ?? 'NA',
            User: [order?.user?.first_name, order?.user?.last_name].filter(Boolean).join(' '),
            Order_Total: order?.total ?? 'NA',
            Status: order?.status ?? 'NA'
        }));

        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
            XLSX.writeFile(workbook, 'order_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'order_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('Order List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Title', "MarketPlace Id", 'User', 'Order Total', 'Status']],
                body: allOrders.map(order => [
                    order?.sell_id ?? 'NA',
                    order?.marketPlace?.title ?? 'NA',
                    order?.marketPlace?.marketPlace_id ?? 'NA'
                    [order?.user?.first_name, order?.user?.last_name].filter(Boolean).join(' '),
                    order?.total ?? 'NA',
                    order?.status ?? 'NA'
                ]),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('order_list.pdf');
        }
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    if (isLoading) return <div>Loading Orders...</div>;
    if (isError) return <div>Error loading Orders.</div>
    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" sx={{
                flexDirection: {
                    xs: 'column', sm: 'row'
                }
            }} mb={2}>
                <Typography variant="h3">Order Listing</Typography>
                <Box display={'flex'} flexDirection={'row'} sx={{
                    mt: { xs: 2, sm: 0 },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                }} gap={4}>
                    <Box display="flex" gap={1} >
                        <FormControl sx={{ minWidth: 200 }} size="medium">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Type"
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="buzzi">Buzzi</MenuItem>
                                <MenuItem value="InPerson">In Person</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }} size="medium">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="Sold">Sold</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
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


            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>MarketPlace ID</strong></TableCell>
                            <TableCell><strong>Buyer Name</strong></TableCell>
                            <TableCell><strong>Seller Name</strong></TableCell>
                            <TableCell><strong>Order Total</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Orders.length > 0 ? (
                            Orders.map((order) => (
                                <TableRow key={order.sell_id}>
                                    <TableCell>{order.sell_id ?? 'NA'}</TableCell>
                                    <TableCell>
                                        {order?.marketPlace?.title ?? 'NA'}
                                    </TableCell>
                                    <TableCell>
                                        {order?.marketPlace?.marketPlace_id ?? 'NA'}
                                    </TableCell>
                                    <TableCell>
                                        {order?.order?.user?.first_name || order?.order?.user?.last_name
                                            ? `${order?.order?.user?.first_name ?? ''} ${order?.order?.user?.last_name ?? ''}`.trim()
                                            : 'NA'}
                                    </TableCell>
                                    <TableCell>
                                        {order?.user?.first_name || order?.user?.last_name
                                            ? `${order?.user?.first_name ?? ''} ${order?.user?.last_name ?? ''}`.trim()
                                            : 'NA'}
                                    </TableCell>


                                    <TableCell>{order.total ?? 'NA'}</TableCell>
                                    <TableCell>
                                        {order?.status ?? 'NA'}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" size="small"
                                            component={Link}
                                            to={`/dashboard/products/${order?.marketPlace?.marketPlace_id}`}
                                            sx={{
                                                '&.Mui-disabled': {
                                                    backgroundColor: 'gray',
                                                    color: 'white',
                                                },
                                            }}>
                                            View
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
}
