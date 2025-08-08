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
import { useMarketPlaceById } from '../../api/ApiCall';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useMarketPlaceStatus } from '../../api/ApiCall';


export default function BoostedDetail() {
    const navigate = useNavigate()
    const { productId } = useParams();
    const { data, isLoading, isError } = useMarketPlaceById(productId);
    const MarketData = data?.marketPlace;
    const client = useQueryClient()
    const marketForm = useFormik({
        initialValues: {
            title: '',
            university: '',
            category: '',
            description: '',
            productStatus: '',
            price: '',
            status: '',
            isSold: '',
            size: '',
            isbootList: "",
            other: [],
            marketPlace_images: []
        },
    });

    useEffect(() => {
        if (MarketData) {
            marketForm.setValues({
                title: MarketData.title ?? '',
                university: MarketData.university ?? '',
                userId: MarketData.user_id ?? "",
                category: MarketData.category ?? '',
                description: MarketData.description ?? '',
                productStatus: MarketData.productStatus ?? '',
                price: MarketData.price ?? '',
                size: MarketData.size ?? '',
                other: MarketData.other ?? [],
                marketPlace_images: MarketData.marketPlace_images ?? [],
                status: MarketData.status ? 'Active' : 'Suspended',
                isSold: MarketData.isSold ? "Yes" : "No",
                isbootList: MarketData.isbootList ? "Yes" : "No",
            });
        }
    }, [MarketData]);



    const { mutate: updateStatus } = useMarketPlaceStatus(
        (data, variables) => {
            if ('status' in variables) {
                toast.success(`MarketPlace ${variables.status ? 'activated' : 'suspended'} successfully`);
                navigate('/dashboard/products')
            } else if ('isBootList' in variables) {
                toast.success(`MarketPlace ${variables.isBootList ? 'boosted' : 'removed from boost'} successfully`);
            }
            client.invalidateQueries(['marketplace', productId]);
        },
        (error, variables) => {
            if ('status' in variables) {
                toast.error(`Failed to ${variables.status ? 'activate' : 'suspend'} MarketPlace`);
                console.log(error)
            } else if ('isBootList' in variables) {
                toast.error(`Failed to ${variables.isBootList ? 'boost' : 'remove boost'} from MarketPlace`);
                console.log(error)
            }
        }
    );


    if (isLoading) return <Box p={2}><Typography variant="h6">Loading...</Typography></Box>;
    if (isError || !MarketData) return <Box p={2}><Typography variant="h5"> No Data found. </Typography></Box>;


    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h3">Market Place Details</Typography>

                <Box display={'flex'} gap={'20px'}>
                    {
                        MarketData.status ? (
                            <Button variant="contained" color="error" onClick={() => updateStatus({ productId: productId, status: false })}>
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
                                }} onClick={() => updateStatus({ productId: productId, status: true })}>
                                    Active
                                </Button>
                            )
                    }

                    {MarketData.isbootList ? (
                        <Button variant="contained" onClick={() => updateStatus({ productId: productId, isBootList: false })}>Boosted</Button>
                    ) : (
                        <Button variant="contained" onClick={() => updateStatus({ productId: productId, isBootList: true })}>Boost</Button>
                    )}


                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid container spacing={2} mb={3}>
                        {marketForm.values.marketPlace_images.map((market_img) => (
                            <Grid size={{ xs: 4 }} key={market_img.market_place_image_id}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <img
                                        src={market_img.image_name}
                                        alt={`Products ${market_img.market_place_image_id + 1}`}
                                        style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: 8 }}
                                    />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <>
                            {/* General Info */}
                            <Typography variant="h5" gutterBottom>General Info</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Title:</InputLabel>
                                        <BootstrapInput value={marketForm.values.title} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Category:</InputLabel>
                                        <BootstrapInput value={marketForm.values.category} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>University:</InputLabel>
                                        <BootstrapInput value={marketForm.values.university} disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Property Details */}
                            <Typography variant="h5" gutterBottom>Property Details</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Price:</InputLabel>
                                        <BootstrapInput value={marketForm.values.price} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Size:</InputLabel>
                                        <BootstrapInput value={marketForm.values.size} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Product Status:</InputLabel>
                                        <BootstrapInput value={marketForm.values.productStatus} disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Status Info */}
                            <Typography variant="h5" gutterBottom>Status Info</Typography>
                            <Grid container rowSpacing={0} columnSpacing={5} mb={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Status:</InputLabel>
                                        <BootstrapInput value={marketForm.values.status} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Boosted:</InputLabel>
                                        <BootstrapInput value={marketForm.values.isbootList} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Is Sold:</InputLabel>
                                        <BootstrapInput value={marketForm.values.isSold ? 'Yes' : 'No'} disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Description & Other Info */}
                            <Grid container rowSpacing={0} columnSpacing={5}>
                                <Grid size={{ xs: 12, sm: 5 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink>Description:</InputLabel>
                                        <BootstrapInput
                                            multiline
                                            rows={5}
                                            value={marketForm.values.description}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <Typography variant="body1">Other</Typography>
                                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                            {marketForm.values.other?.map((other, index) =>
                                                typeof other === 'object' && other !== null
                                                    ? Object.entries(other).map(([key, value], subIndex) => (
                                                        <Chip key={`${index}-${subIndex}`} label={`${key}: ${value}`} color="secondary" />
                                                    ))
                                                    : <Chip key={index} label={String(other)} color="secondary" />
                                            )}
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
