// PropertiesTable.jsx
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
    FormControl, InputLabel, Select, Switch
} from '@mui/material';
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useSublease, useDeleteSublease, useUpdateSubleaseStatus } from '../../api/ApiCall';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import axiosInstance from '../../api/axiosInstance'
import DeleteConfirm from '@/common/DeleteConfirm';

export default function ListOfSublease() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useSublease(page, 7, search, statusFilter);
    const { mutate: deleteSublease } = useDeleteSublease();
    const { mutate: updateStatus } = useUpdateSubleaseStatus();
    const Sublease = data?.sublease.data || [];
    const client = useQueryClient()
    const totalPages = data?.sublease?.pagination.totalPages || 1;
    if (isLoading) return <div>Loading Sublease...</div>;
    if (isError) return <div>Error loading Sublease.</div>

    const handleDelete = () => {
        if (!selectedId) return;
        deleteSublease(selectedId, {
            onSuccess: () => {
                client.invalidateQueries(['sublease', selectedId]);
                toast.success("Sublease deleted successfully");
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
    const handleStatusToggle = (subleaseId, isChecked) => {
        const newStatus = !isChecked
        updateStatus({ subleaseId, status: newStatus }, {
            onSuccess: () => {
                client.invalidateQueries(['sublease', subleaseId]);
                toast.success(`Sublease Status ${newStatus ? 'Active' : 'Suspended'} `)
            },
            onError: (error) => {
                toast.error(error?.response?.data.message || "something went wrong")
            }
        })
    }

    // exports
    const fetchAllSubleases = async () => {
        try {
            const response = await axiosInstance.post('/sublease', {
                page: 1,
                limit: 10000
            });
            return response.data?.sublease?.data || [];
        } catch (error) {
            toast.error('Failed to fetch all subleases');
            return [];
        }
    };


    const handleExport = async (type) => {
        const allSubleases = await fetchAllSubleases();
        if (allSubleases.length === 0) {
            toast.warn('No subleases available for export');
            return;
        }

        const exportData = allSubleases.map((sublease) => ({
            ID: sublease?.sublease_id ?? 'NA',
            Title: sublease?.title ?? 'NA',
            University: sublease?.university ?? 'NA',
            Category: sublease?.category ?? 'NA',
            Price: sublease?.price ?? 'NA',
            Boosted: sublease?.isbootList ? 'Yes' : 'No'
        }));

        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sublease');
            XLSX.writeFile(workbook, 'sublease_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sublease_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('Sublease List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Title', 'University', 'Category', 'Price', 'Boosted']],
                body: allSubleases.map(sublease => [
                    sublease?.sublease_id ?? 'NA',
                    sublease?.title ?? 'NA',
                    sublease?.university ?? 'NA',
                    sublease?.category ?? 'NA',
                    sublease?.price ?? 'NA',
                    sublease?.isbootList ? 'Yes' : 'No'
                ]),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('sublease_list.pdf');
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
                <Typography variant="h3">Sublease Listing</Typography>
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
                            <TableCell><strong>Boosted</strong></TableCell>
                            <TableCell><strong>Suspend</strong></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Sublease?.length > 0 ? (
                            Sublease?.map((sublease) => (
                                <TableRow key={sublease?.sublease_id}>
                                    <TableCell>{sublease?.sublease_id ?? 'NA'}</TableCell>
                                    <TableCell>
                                        {sublease?.title ?? 'NA'}
                                    </TableCell>
                                    <TableCell>{sublease?.university ?? 'NA'}</TableCell>
                                    <TableCell>{sublease?.category ?? 'NA'}</TableCell>

                                    <TableCell>{sublease?.price ?? 'NA'}</TableCell>

                                    <TableCell>{sublease?.isbootList === false ? 'No' : 'Yes'}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={!sublease?.status}
                                            onChange={(e) => handleStatusToggle(sublease.sublease_id, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" size="small"
                                            component={Link}
                                            to={`/dashboard/sublease/${sublease?.sublease_id}`}
                                            disabled={sublease?.status === false}
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
                                            setSelectedId(sublease?.sublease_id)
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
                title="Delete Sublease"
                content="Are you sure you want to delete this sublease?"
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
                </Box>
            }
        </Box>
    );
}
