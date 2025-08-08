import React, { useState } from 'react';
import {
    TextField, Typography, Stack, Grid, Box, Pagination, Button, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Add } from '@mui/icons-material';
import DeleteConfirm from '@/common/DeleteConfirm';
import { useDelNotification, useGetNotification, useCreateNotification } from '../../api/ApiCall';

const Notification = () => {
    const [title, setTitle] = useState('');
    const client = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDialogOpen(false);
    };
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const { data } = useGetNotification(page, 6)
    const notifications = data?.Notification?.data
    const totalPages = data?.Notification?.pagination.totalPages || 1;

    const { mutate: deleteNotification } = useDelNotification();
    const { mutate } = useCreateNotification();


    const handleDeleteNotification = () => {
        if (!selectedId) return;
        deleteNotification(selectedId, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ["notifications"], exact: false });
                toast.success('Notification deleted!');
                setConfirmOpen(false);
                setSelectedId(null);
            },
            onError: () => {
                toast.error('Delete failed.')
                setConfirmOpen(false);
                setSelectedId(null);
            }
        })
    }
    const handleCreateNotification = () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!description.trim()) {
            toast.error("Description is required");
            return;
        }
        const notificationData = { title, description };
        mutate(notificationData, {
            onSuccess: () => {
                toast.success('Notification created successfully!');
                client.invalidateQueries({ queryKey: ["notifications"], exact: false });
                resetForm();
            },
            onError: (error) => {
                console.error('Error creating notification:', error);
                toast.error('Failed to create notification.');
            },
        });
    };


    return (
        <>
            <Box display="flex" justifyContent="space-between" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} mb={2}>
                <Typography variant="h3">Notification History</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)} sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '50%', sm: '30%', md: '20%' } }}>
                    Add Notification
                </Button>
            </Box>
            {notifications && notifications.length > 0 ? (
                <Stack spacing={2}>
                    <Grid container gap={4} pt={3} >
                        {Array.isArray(notifications) && notifications.map((note) => (
                            <Grid key={note.notification_id} size={{ md: 3.67, sm: 5.5, xs: 12 }} sx={{
                                border: '1px solid gray',
                                borderRadius: '10px',
                                position: 'relative'
                            }}>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setSelectedId(note.notification_id)
                                        setConfirmOpen(true)
                                    }}
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                >
                                    <DeleteIcon color="error" />
                                </IconButton>
                                <Grid container sx={{ p: 2 }}>
                                    <Grid size={12}>
                                        <Typography variant='h4' sx={{ pb: 1 }}><b>{note.title}</b></Typography>
                                        <Typography color='#98A2B3' variant='body1' sx={{ py: 1 }}>{note.description}</Typography>
                                    </Grid>
                                </Grid>

                                <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                                    {new Date(note.createdAt).toLocaleString()}
                                </Typography>
                            </Grid>
                        ))}

                    </Grid>


                </Stack>
            ) : (
                <Box mt={4}>
                    <Typography variant="h4" color='secondary'> No Data found.</Typography>
                </Box>
            )}
            <Dialog open={dialogOpen} onClose={resetForm} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontSize: '1.4em ' }}><b>Send Push Notification</b></DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetForm}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateNotification} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Notification'}
                    </Button>
                </DialogActions>
            </Dialog>
            <DeleteConfirm
                open={confirmOpen}
                title="Delete Notification"
                content="Are you sure you want to delete this notification?"
                onConfirm={handleDeleteNotification}
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

        </>

    );
};

export default Notification;
