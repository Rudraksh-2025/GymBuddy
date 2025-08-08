import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardMedia, CardActions,
    Button, Dialog, DialogTitle, DialogActions, IconButton,
    Pagination, FormControl, InputLabel, Select, MenuItem,
    TextField
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import {
    useGetAllAds,
    useCreateAds,
    useUpdateAds,
    useDelAds
} from '../../api/ApiCall';
import { toast } from 'react-toastify';
import DeleteConfirm from '@/common/DeleteConfirm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function AdModule() {
    const [image, setImage] = useState(null);
    const [type, setType] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const { data, isLoading, refetch } = useGetAllAds(page, 6);
    const ads = data?.Ads?.data
    const totalPages = data?.Ads?.pagination.totalPages || 1;

    const createAd = useCreateAds({
        onSuccess: (data) => {
            toast.success("Ad created successfully!");
            refetch();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create ad.");
        },
    });


    const updateAd = useUpdateAds({
        onSuccess: () => refetch(),
    });

    const deleteAd = useDelAds({
        onSuccess: () => refetch(),
    });

    const resetForm = () => {
        setImage(null);
        setType('');
        setPreviewUrl(null);
        setDialogOpen(false);
        setEditIndex(null);
        setStartDate(null);
        setEndDate(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleAddOrUpdate = () => {
        if (!type) {
            toast.error("Please select a type.");
            return;
        }
        if (!startDate) {
            toast.error("Please select a start date.");
            return;
        }


        if (!image && editIndex === null) {
            toast.error("Please upload an image.");
            return;
        }


        const formData = new FormData();
        if (startDate && endDate && startDate > endDate) {
            toast.error("Start date cannot be after end date.");
            return;
        }
        if (image) {
            formData.append('image', image);
        }
        formData.append('type', type);
        if (startDate) formData.append('startDate', startDate.toISOString());
        if (endDate) formData.append('endDate', endDate.toISOString());


        if (editIndex !== null) {
            updateAd.mutate({ adId: editIndex, data: formData });
        } else {
            if (!type) {
                toast.error("Please select type");
                return;
            }
            if (!image && editIndex === null) {
                toast.error("Please upload an image");
                return;
            }
            createAd.mutate(formData);
        }

        resetForm();
    };
    useEffect(() => {
        resetForm();
    }, [page]);

    const handleEdit = (index, adId) => {
        setEditIndex(adId);
        setDialogOpen(true);
        setPreviewUrl(ads[index].image_name);
        setType(ads[index].type || '');
        setStartDate(ads[index].startDate ? new Date(ads[index].startDate) : null);
        setEndDate(ads[index].endDate ? new Date(ads[index].endDate) : null);

    };
    const confirmDelete = () => {
        if (!selectedAdId) return
        handleDelete(selectedAdId)
        setConfirmOpen(false);
        setSelectedAdId(null);
    }
    const handleDelete = (adId) => {
        deleteAd.mutate(adId);
    };

    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h3">Ad Banners</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                    Add Banner
                </Button>
            </Box>

            <Grid container spacing={2}>
                {ads?.length > 0 ? (
                    ads.map((ad, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ad.image_id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={ad.image_name}
                                    sx={{
                                        objectFit: 'contain',
                                        backgroundColor: '#f0f0f0'
                                    }}
                                    alt={`Ad ${index + 1}`}
                                />
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <IconButton onClick={() => handleEdit(index, ad.image_id)}><Edit /></IconButton>
                                    <IconButton color="error" onClick={() => {
                                        setSelectedAdId(ad.image_id)
                                        setConfirmOpen(true)
                                    }
                                    }><Delete /></IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" color="textSecondary"> No Data found.</Typography>
                )}
            </Grid>

            <Dialog open={dialogOpen} onClose={resetForm}>
                <DialogTitle>{editIndex !== null ? "Edit Banner" : "Add Banner"}</DialogTitle>
                <Box p={2} sx={{ minWidth: '300px' }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="ad-type-label">Select Type</InputLabel>
                        <Select
                            labelId="ad-type-label"
                            value={type}
                            label="Select Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="sublease">Sublease</MenuItem>
                            <MenuItem value="marketplace">Marketplace</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mb: 2, gap: 2, display: 'flex', flexDirection: 'row' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                                minDate={startDate}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <Button variant="outlined" fullWidth onClick={() => document.getElementById('ad-image-input').click()}>
                        Upload Image
                    </Button>
                    <input
                        id="ad-image-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {previewUrl && (
                        <Box mt={2}>
                            <img src={previewUrl} alt="Preview" style={{ width: '100%', borderRadius: 8 }} />
                        </Box>
                    )}
                </Box>
                <DialogActions>
                    <Button onClick={resetForm}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddOrUpdate}>
                        {editIndex !== null ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
            <DeleteConfirm
                open={confirmOpen}
                title="Delete Ad"
                content="Are you sure you want to delete this ad?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedAdId(null);
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
