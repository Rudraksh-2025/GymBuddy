import { useState } from 'react';
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
    Menu, MenuItem,
    Dialog, DialogTitle,
    DialogContent,
    DialogActions, Stack
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Switch } from '@mui/material';
import { useUniversities, useDelUni, useUpdateUniStatus, useUpdateUni, useCreateUni } from '../../api/ApiCall';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirm from '@/common/DeleteConfirm';

export default function ListOfUniversities() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [name, setName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const client = useQueryClient()
    const [editingUniversity, setEditingUniversity] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUniId, setSelectedUniId] = useState(null);
    // const [search, setSearch] = useState('');
    const { data, isLoading, isError } = useUniversities();
    const universities = data?.university.rows || [];
    const { mutate, isPending } = useCreateUni();
    const { mutate: deleteUni } = useDelUni();
    const { mutate: updateStatus } = useUpdateUniStatus();
    const { mutate: updateUni } = useUpdateUni({
        onSuccess: () => {
            toast.success('University updated successfully!');
            client.invalidateQueries({ queryKey: ['universities'] });
            resetForm();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update university.');
        },
    });
    if (isLoading) return <div>Loading universities...</div>;
    if (isError) return <div>Error loading universities.</div>
    const resetForm = () => {
        setName('');
        setEditingUniversity(null);
        setDialogOpen(false);
    };

    // university delete
    const confirmDelete = () => {
        if (!selectedUniId) return;
        deleteUni(selectedUniId, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ["universities"] });
                toast.success("University deleted successfully");
                setConfirmOpen(false);
                setSelectedUniId(null);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
                setConfirmOpen(false);
                setSelectedUniId(null);
            }
        });
    };

    // status toggle
    const handleStatusToggle = (uniId, isChecked) => {
        const newStatus = !isChecked;
        updateStatus({ uniId, params: { status: newStatus } }, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ['universities'], exact: false });
                toast.success(`University Status  ${newStatus ? 'Active' : 'Suspended'}`);
            },
            onError: (error) => {
                toast.error(error?.response?.data.message || "something went wrong")
            }
        })
    }
    // create or edit university
    const handleCreateUniversity = () => {
        const universityData = { name };
        if (!name.trim()) {
            toast.error('University name cannot be empty');
            return;
        }
        if (editingUniversity) {
            // update logic
            updateUni({ uniId: editingUniversity.university_id, data: { name } });
        } else {
            // create logic

            mutate(universityData, {
                onSuccess: () => {
                    toast.success('University created successfully!');
                    client.invalidateQueries({ queryKey: ['universities'] });
                    resetForm();
                },
                onError: (error) => {
                    toast.error('Failed to create university.');
                },
            });
        }
    };

    // edit university
    const handleEditClick = (university) => {
        setEditingUniversity(university);
        setName(university.name);
        setDialogOpen(true);
    };

    // exports
    const fetchAllUni = async () => {
        try {
            const response = await axiosInstance.get('/university/');
            return response.data?.university?.rows || [];
        } catch (error) {
            toast.error('Failed to fetch all universities');
            return [];
        }
    };
    const handleExport = async (type) => {
        const allUniversities = await fetchAllUni();
        if (allUniversities.length === 0) {
            toast.warn('No university available for export');
            return;
        }

        const exportData = allUniversities.map((university) => ({
            ID: university?.university_id ?? 'NA',
            Name: university?.name ?? 'NA',
            Status: university?.status ? 'Active' : 'Suspended'
        }));

        if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
                wch: Math.max(key.length, ...exportData.map((row) => String(row[key] ?? 'NA').length)) + 2
            }));
            worksheet['!cols'] = columnWidths;
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Universities');
            XLSX.writeFile(workbook, 'university_list.xlsx');
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'university_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.text('University List', 14, 16);
            autoTable(doc, {
                head: [['ID', 'Name', 'Status']],
                body: allUniversities.map(university => [
                    university?.university_id ?? 'NA',
                    university?.name ?? 'NA',
                    university?.status ? 'Active' : 'Suspended'
                ]),
                startY: 20,
                theme: 'striped',
                headStyles: { fillColor: [255, 130, 0] },
                margin: { top: 20 },
                styles: { fontSize: 10 },
            });
            doc.save('university_list.pdf');
        }
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" mb={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="h3">University Listing</Typography>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'center' }, alignItems: 'center', flexDirection: 'row', gap: '15px', mt: { xs: 2, sm: 0 } }}>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)} sx={{ mt: { xs: 0, sm: 0 } }}>
                        Add University
                    </Button>
                    <Box>
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


            </Box>
            {/* <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by University name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            /> */}

            <TableContainer component={Paper}
                sx={{
                    maxHeight: { xs: 600, sm: 550 },
                    overflowY: 'auto'
                }}>
                <Table stickyHeader>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>University Name</strong></TableCell>
                            <TableCell><strong>Suspend</strong></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {universities?.length > 0 ? (
                            universities?.map((university) => (
                                <TableRow key={university?.university_id}>
                                    <TableCell>{university?.university_id ?? 'NA'}</TableCell>
                                    <TableCell>
                                        {university?.name}
                                    </TableCell>

                                    <TableCell>
                                        <Switch
                                            checked={!university?.status}
                                            onChange={(e) => handleStatusToggle(university?.university_id, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Button variant="contained" color="secondary" size="small" onClick={() => handleEditClick(university)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" size="small" onClick={() => {
                                            setSelectedUniId(university.university_id);
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
            <Dialog open={dialogOpen} onClose={resetForm} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontSize: '1.4em' }}>
                    <b>{editingUniversity ? 'Edit University' : 'Create University'}</b>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="University Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetForm}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateUniversity} disabled={isPending}>
                        {isPending ? 'Creating...' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
            <DeleteConfirm
                open={confirmOpen}
                title="Delete University"
                content="Are you sure you want to delete this university?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedUniId(null);
                }}
            />

        </Box>
    );
}
