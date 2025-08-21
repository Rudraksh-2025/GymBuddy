import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Button,
    Pagination, Menu, MenuItem
} from '@mui/material';
import { Switch } from '@mui/material';
import { Link } from 'react-router-dom';
// import { useUsers, useDeleteUser } from '../../api/ApiCall';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// import { useUpdateStatus } from '../../api/ApiCall';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import axiosInstance from '../../api/axiosInstance'
import DeleteConfirm from '@/common/DeleteConfirm';

export default function ListOfUsers() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { data, isLoading, isError } = useUsers(page, 7, search);
    const { mutate: deleteUser } = useDeleteUser();
    const { mutate: updateStatus } = useUpdateStatus();
    const users = data?.user.data || [];
    const client = useQueryClient()
    const totalPages = data?.user?.pagination.totalPages || 1;
    if (isLoading) return <div>Loading users...</div>;
    if (isError) return <div>Error loading users.</div>


    // user delete
    const confirmDelete = () => {
        if (!selectedUserId) return;
        deleteUser(selectedUserId, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ["users"], exact: false });
                toast.success("User deleted successfully");
                setConfirmOpen(false);
                setSelectedUserId(null);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
                setConfirmOpen(false);
                setSelectedUserId(null);
            }
        });
    };
    // status toggle
    const handleStatusToggle = (userId, isChecked) => {
        // If checked, set to false (suspended), else true (active)
        const newStatus = !isChecked;
        updateStatus({ userId, params: { status: newStatus } }, {
            onSuccess: () => {
                client.invalidateQueries(['user', userId]);
                toast.success(`User Status ${newStatus ? 'Active' : 'Suspended'}`);
            },
            onError: (error) => {
                toast.error(error?.response?.data.message || "something went wrong");
            }
        });
    };

    // chat toggle 
    const handleChatToggle = (userId, isEnabled) => {
        updateStatus({ userId, params: { isChatEnable: isEnabled } }, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ['users'], exact: false });
                toast.success(`User Chat ${isEnabled ? 'Enabled' : 'Disabled'} `)
            },
            onError: (error) => {
                toast.error(error?.response?.data.message || "something went wrong")
            }
        })
    };

    // exports
    const fetchAllUsers = async () => {
        try {
            const response = await axiosInstance.get('/auth/getAllUser', {
                params: { page: 1, limit: 10000 }
            });
            return response.data?.user?.data || [];
        } catch (error) {
            toast.error('Failed to fetch all users');
            return [];
        }
    };

    const handleExport = async (type) => {
        const allUsers = await fetchAllUsers();
        if (allUsers.length === 0) {
            toast.warn('No users available for export');
            return;
        }

        const exportData = allUsers.map((user) => ({
            ID: user?.user_id ?? 'NA',
            Name: user?.first_name ?? 'NA',
            Email: user?.email ?? 'NA',
            University: user?.university_name ?? 'NA',
            Status: user?.status ? 'Active' : 'Suspended'
        }));

        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
            XLSX.writeFile(workbook, 'user_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'user_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('User List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Name', 'Email', 'University', 'Status']],
                body: allUsers.map(user => [
                    user?.user_id ?? 'NA',
                    user?.first_name ?? 'NA',
                    user?.email ?? 'NA',
                    user?.university_name ?? 'NA',
                    user?.status ? 'Active' : 'Suspended'
                ]),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('user_list.pdf');
        }
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h3">User Listing</Typography>
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
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by Name, Email, or University"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Suspend</strong></TableCell>
                            <TableCell><strong>Chat </strong></TableCell>
                            <TableCell><strong>University</strong></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.user_id}>
                                    <TableCell>{user.user_id ?? 'NA'}</TableCell>
                                    <TableCell>
                                        {user.first_name || user.last_name
                                            ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
                                            : 'NA'}
                                    </TableCell>
                                    <TableCell>{user.email ?? 'NA'}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={!user.status}
                                            onChange={(e) => handleStatusToggle(user.user_id, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={user.isChatEnable ?? false}
                                            onChange={(e) => handleChatToggle(user.user_id, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>{user.university_name ?? 'NA'}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" size="small"
                                            component={Link}
                                            to={`/dashboard/users/${user.user_id}`}>
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" size="small" onClick={() => {
                                            setSelectedUserId(user.user_id);
                                            setConfirmOpen(true);
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
                title="Delete User"
                content="Are you sure you want to delete this user?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedUserId(null);
                }}
            />
            {totalPages > 1 && <Box display="flex" justifyContent="center" mt={2}>
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
