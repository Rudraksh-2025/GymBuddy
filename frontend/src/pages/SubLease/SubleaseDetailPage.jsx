import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Chip
} from '@mui/material';
import { useFormik } from "formik"
import { BootstrapInput } from '../../common/BootstrapInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useSubleaseById } from '../../api/ApiCall';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useUpdateSubleaseStatus } from '../../api/ApiCall';


export default function SubleaseDetailPage() {
    const { subleaseId } = useParams();
    const { data, isLoading, isError } = useSubleaseById(subleaseId);
    const subleaseData = data?.sublease;
    const client = useQueryClient()
    const navigate = useNavigate()
    const subleaseForm = useFormik({
        initialValues: {
            title: '',
            university: '',
            category: '',
            description: '',
            gender: '',
            furnitureStatus: '',
            room: '',
            bath: '',
            bed: '',
            price: '',
            street: '',
            city: '',
            state: '',
            startDate: '',
            endDate: '',
            address: '',
            latitude: '',
            longitude: '',
            paymentSchedule: "",
            Amenities: [],
            status: '',
            isbootList: "",
            sublease_images: []
        },
    });
    useEffect(() => {
        if (subleaseData) {
            subleaseForm.setValues({
                title: subleaseData.title ?? '',
                university: subleaseData.university ?? '',
                userId: subleaseData.user_id ?? "",
                category: subleaseData.category ?? '',
                description: subleaseData.description ?? '',
                gender: subleaseData.gender ?? '',
                furnitureStatus: subleaseData.furnitureStatus ?? '',
                room: subleaseData.room ?? '',
                bath: subleaseData.bath ?? '',
                bed: subleaseData.bed ?? '',
                price: subleaseData.price ?? '',
                Amenities: subleaseData.Amenities ?? [],
                address: subleaseData.address ?? "",
                street: subleaseData.street ?? "",
                city: subleaseData.city ?? "",
                state: subleaseData.state ?? "",
                latitude: subleaseData.latitude ?? "",
                startDate: subleaseData.startDate ?? "",
                endDate: subleaseData.endDate ?? "",
                longitude: subleaseData.longitude ?? "",
                paymentSchedule: subleaseData.paymentSchedule ?? "",
                sublease_images: subleaseData.sublease_images ?? [],
                status: subleaseData.status ? 'Active' : 'Suspended',
                isbootList: subleaseData.isbootList ? "Yes" : "No",
            });
        }
    }, [subleaseData]);
    const { mutate: updateStatus } = useUpdateSubleaseStatus(
        (data, variables) => {
            if ('status' in variables) {
                toast.success(`Sublease ${variables.status ? 'activated' : 'suspended'} successfully`);
                navigate('/dashboard/sublease')
            } else if ('isBootList' in variables) {
                toast.success(`Sublease ${variables.isBootList ? 'boosted' : 'removed from boost'} successfully`);
            }
            client.invalidateQueries(['sublease', subleaseId]);
        },
        (error, variables) => {
            if ('status' in variables) {
                toast.error(`Failed to ${variables.status ? 'activate' : 'suspend'} sublease`);
            } else if ('isBootList' in variables) {
                toast.error(`Failed to ${variables.isBootList ? 'boost' : 'remove boost'} from sublease`);
            }
        }
    );


    if (isLoading) return <Box p={2}><Typography variant="h6">Loading...</Typography></Box>;
    if (isError || !subleaseData) return <Box p={2}><Typography variant="h5">No Data found.</Typography></Box>;


    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" sx={{
                flexDirection: {
                    xs: 'column', '@media (min-width:600px)': {
                        flexDirection: 'row'
                    }
                }
            }} mb={2}>
                <Typography variant="h3">Sublease Details</Typography>

                <Box display={'flex'} gap={'20px'} sx={{
                    mt: 1,
                    justifyContent: 'space-between',
                    '@media (min-width:600px)': {
                        mt: 0,
                        justifyContent: 'flex-start'
                    }
                }}>
                    {
                        subleaseData.status ? (
                            <Button variant="contained" color="error" onClick={() => updateStatus({ subleaseId: subleaseId, status: false })}>
                                Suspend
                            </Button>
                        ) :
                            (
                                <Button variant="contained" sx={{
                                    backgroundColor: theme => theme.palette.success.dark,
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: theme => theme.palette.success.dark
                                    }
                                }} onClick={() => updateStatus({ subleaseId: subleaseId, status: true })}>
                                    Activate
                                </Button>
                            )
                    }

                    {/* {subleaseData.isbootList ? (
                        <Button variant="contained" onClick={() => updateStatus({ subleaseId: subleaseId, isBootList: false })}>Boosted</Button>
                    ) : (
                        <Button variant="contained" onClick={() => updateStatus({ subleaseId: subleaseId, isBootList: true })}>Boost</Button>
                    )} */}
                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid container spacing={2} mb={3}>
                        {subleaseForm.values.sublease_images.map((sublease_img) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sublease_img.sublease_image_id}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <img
                                        src={sublease_img.image_name}
                                        alt={`Property ${sublease_img.sublease_image_id + 1}`}
                                        style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: 8 }}
                                    />
                                </Paper>
                            </Grid>
                        ))}
                        {/* {dummyProperty.images.map((img, idx) => (
                            <Grid size={{ xs: 6, md: 3 }} key={idx}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <img
                                        src={img}
                                        alt={`Property ${idx + 1}`}
                                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 8 }}
                                    />
                                </Paper>
                            </Grid>
                        ))} */}
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <>
                            <Typography variant="h5" gutterBottom>General Info</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Title:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.title} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Category:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.category} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>University:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.university} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Start Date:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.startDate} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>End Date:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.endDate} disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Typography variant="h5" gutterBottom>Location Info</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Street:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.street || 'Massachusetts Ave'} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Address:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.address} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>City:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.city || 'Cambridge'} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>State:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.state || 'MA'} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Latitude:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.latitude || '42.3736'} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Longitude:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.longitude || '-71.1097'} disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Typography variant="h5" gutterBottom>Property Details</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Price:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.price} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Rooms:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.room} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Number of Beds:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.bed} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Number of Bath:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.bath} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Furniture Status:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.furnitureStatus} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Payment Schedule:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.paymentSchedule} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>

                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Gender:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.gender} disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Typography variant="h5" gutterBottom>Status Info</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Status:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.status} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Boosted:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.isbootList} disabled />
                                    </FormControl>
                                </Grid>
                                {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Sold:</InputLabel>
                                        <BootstrapInput value={subleaseForm.values.isSold ? 'Yes' : 'No'} disabled />
                                    </FormControl>
                                </Grid> */}
                            </Grid>
                            <Grid container rowSpacing={0} columnSpacing={5} >
                                <Grid size={{ xs: 12, sm: 5 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-description">Description:</InputLabel>
                                        <BootstrapInput
                                            name="description"
                                            id="bootstrap-description"
                                            multiline
                                            rows={5}
                                            value={subleaseForm.values.description}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <Typography variant="body1" color="initial">Amenities </Typography>
                                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                            {subleaseForm.values.Amenities.map((amenity, index) => (
                                                <Chip
                                                    key={index}
                                                    label={amenity}
                                                    color="secondary"
                                                />
                                            ))}
                                        </Box>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    </Grid>
                </Grid>
            </Paper>

        </Box>
    );
}
