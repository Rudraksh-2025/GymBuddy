import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Button, Pagination, MenuItem, Grid, Avatar, IconButton,
    Select
} from '@mui/material';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useFormik } from "formik"
import { BootstrapInput } from '../../common/BootstrapInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useUserById, useUpdateUser, useUserTransaction } from '../../api/ApiCall';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useUpdateStatus, useMarketPlace, useSublease, useDeleteMarketPlace, useDeleteSublease } from '../../api/ApiCall';
import { Link } from 'react-router-dom';
import { userValidationSchema } from '../../common/FormValidations'
export default function UserPage() {
    const [marketPage, setMarketPage] = useState(1);
    const [subleasePage, setSubleasePage] = useState(1);
    const { userId } = useParams();
    const { data, isLoading, isError } = useUserById(userId);
    const userData = data?.user;
    const client = useQueryClient()
    const [listingType, setListing] = useState('marketplace')
    const { data: marketData, isLoading: isLoadingMarket, isError: isErrorMarket } = useMarketPlace(marketPage, 5, '', 'active', userId);
    const { data: subleaseData, isLoading: isLoadingSublease, isError: isErrorSublease } = useSublease(subleasePage, 5, '', 'active', userId);

    const { data: TransactionData, isLoading: isLoadingTransaction, isError: isErrorTransaction } = useUserTransaction(10000, userId)

    const [edit, setEdit] = useState(false);

    const submithandler = (values) => {
        setEdit(false);
        const formData = new FormData();

        formData.append("firstName", values.first_name);
        formData.append("lastName", values.last_name);
        formData.append("phoneNumber", values.phone_number);
        formData.append("address", values.address);
        formData.append("street", values.street);
        formData.append("city", values.city);
        formData.append("state", values.state);
        formData.append("latitude", values.latitude);
        formData.append("longitude", values.longitude);

        if (values.image instanceof File) {
            formData.append("image", values.image);
        }

        mutate({ userId, data: formData });
    }

    const userform = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            university_name: '',
            phone_number: '',
            image: '',
            address: " ",
            street: " ",
            city: " ",
            state: " ",
            latitude: " ",
            longitude: " ",
        },
        validationSchema: userValidationSchema,
        onSubmit: submithandler
    })

    useEffect(() => {
        if (userData && !edit) {
            userform.setValues({
                first_name: userData.first_name ?? '',
                last_name: userData.last_name ?? '',
                email: userData.email ?? '',
                university_name: userData.university_name ?? '',
                phone_number: userData.phone_number ?? '',
                status: userData.status ? 'Active' : 'Suspended',
                role: userData.role ?? '',
                image: userData.profile_pic ?? '',
                address: userData.address ?? '',
                street: userData.street ?? '',
                city: userData.city ?? '',
                state: userData.state ?? '',
                latitude: userData.latitude ?? '',
                longitude: userData.longitude ?? '',
            });
        }
    }, [userData, edit]);

    const onSuccess = () => {
        client.invalidateQueries(['user', userId]);
        toast.success("User Updated Successfully.");
    }
    const onError = (error) => {
        console.error("Update Error:", error);
        toast.error("Something went Wrong")
    }
    const { mutate } = useUpdateUser(onSuccess, onError)


    const { mutate: updateStatus } = useUpdateStatus(
        () => {
            toast.success("Status updated");
            client.invalidateQueries(['user', userId]);
        },
        (err) => toast.error("Failed to update")
    );
    const { mutate: deleteProduct } = useDeleteMarketPlace();
    const { mutate: deleteSublease } = useDeleteSublease();

    // marketplace delete
    const handleMarketDelete = (productId) => {
        deleteProduct(productId, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ["marketplaces"], exact: false });
                toast.success("MarketPlace deleted successfully");
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
            }
        });
    };
    // sublease delete
    const handleSubleaseDelete = (subleaseId) => {
        deleteSublease(subleaseId, {
            onSuccess: () => {
                client.invalidateQueries({ queryKey: ["subleases"], exact: false });
                toast.success("Sublease deleted successfully");
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
            }
        });
    };


    if (isLoading) return <Box p={2}><Typography variant="h6">Loading...</Typography></Box>;
    if (isError || !userData) return <Box p={2}><Typography variant="h5"> No Data found.</Typography></Box>;
    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h4">User Details</Typography>

                <Box display={'flex'} gap={'20px'}>
                    {
                        userData.status ? (
                            <Button variant="contained" color="error" onClick={() => updateStatus({ userId: userId, params: { status: false } })}>
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
                                }} onClick={() => updateStatus({ userId: userId, params: { status: true } })}>
                                    Activate
                                </Button>
                            )
                    }
                    {edit ? (
                        <Button variant="contained" onClick={userform.handleSubmit}>Save</Button>
                    ) : (
                        <Button variant="contained" onClick={() => setEdit(true)}>Edit</Button>
                    )}
                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 2 }} display={'flex'} flexDirection={'row'} gap={'50px'} sx={{ justifyContent: { xs: 'center', sm: 'start' } }}>
                        <Box >
                            <Box sx={{ position: "relative", display: "inline-block" }}>
                                <Avatar
                                    src={
                                        userform.values.image instanceof File
                                            ? URL.createObjectURL(userform.values.image)
                                            : userform.values.image
                                    }
                                    alt="Profile"
                                    sx={{ width: 100, height: 100 }}
                                />
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        p: 0.5,
                                        "&:hover": { backgroundColor: "#eee" },
                                    }}
                                >
                                    <PhotoCameraIcon fontSize="small" />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                userform.setFieldValue("image", file);
                                            }
                                        }}
                                        disabled={!edit}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 10 }} >
                        <>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-name">
                                            First Name:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="first_name"
                                            id="bootstrap-input-name"
                                            value={userform.values.first_name}
                                            onChange={userform.handleChange}
                                            disabled={!edit}
                                        />
                                        {userform.touched.first_name && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.first_name}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-Lastname">
                                            Last Name:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="last_name"
                                            id="bootstrap-input-Lastname"
                                            value={userform.values.last_name}
                                            onChange={userform.handleChange}
                                            disabled={!edit}
                                        />
                                        {userform.touched.last_name && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.last_name}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-phone">
                                            Phone:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="phone_number"
                                            id="bootstrap-input-phone"
                                            value={userform.values.phone_number}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                        {userform.touched.phone_number && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.phone_number}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-university">
                                            University:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="university_name"
                                            id="bootstrap-input-university"
                                            value={userform.values.university_name}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>

                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-status">
                                            Status:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="status"
                                            id="bootstrap-input-status"
                                            value={userform.values.status}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-email">
                                            Email:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="email"
                                            id="bootstrap-input-email"
                                            value={userform.values.email}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-address">
                                            Address:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="address"
                                            id="bootstrap-input-address"
                                            value={userform.values.address}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                        {userform.touched.address && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.address}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-street">
                                            Street:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="street"
                                            id="bootstrap-input-street"
                                            value={userform.values.street}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                    </FormControl>
                                    {userform.touched.street && !userform.isSubmitting && (
                                        <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.street}</div>
                                    )}
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-city">
                                            City:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="city"
                                            id="bootstrap-input-city"
                                            value={userform.values.city}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                        {userform.touched.city && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.city}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-state">
                                            State:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="state"
                                            id="bootstrap-input-state"
                                            value={userform.values.state}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                        {userform.touched.state && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.state}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-latitude">
                                            Latitude:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="latitude"
                                            id="bootstrap-input-latitude"
                                            value={userform.values.latitude}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                        {userform.touched.latitude && userform.errors.latitude && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.latitude}</div>
                                        )}
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="bootstrap-input-longitude">
                                            Longitude:
                                        </InputLabel>
                                        <BootstrapInput
                                            name="longitude"
                                            id="bootstrap-input-longitude"
                                            value={userform.values.longitude}
                                            disabled={!edit}
                                            onChange={userform.handleChange}
                                        />
                                        {userform.touched.longitude && !userform.isSubmitting && (
                                            <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.longitude}</div>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                {isLoadingTransaction ? (
                    <Typography color="text.secondary" p={1}>Loading Transaction data...</Typography>
                ) : isErrorTransaction ? (
                    <Typography color="error" p={1}>Error loading Transaction history.</Typography>) :
                    (<Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h4">Transaction History</Typography>
                        </Box>
                        {TransactionData?.data?.length > 0 ?
                            (<TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell><strong>Transaction ID</strong></TableCell>
                                            <TableCell><strong>Amount (USD)</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Paid</strong></TableCell>
                                            <TableCell><strong>Refunded Amount</strong></TableCell>
                                            <TableCell><strong>Buyer Name</strong></TableCell>
                                            <TableCell><strong>Created</strong></TableCell>
                                            <TableCell><strong>Receipt</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            TransactionData?.data?.map((txn) => (
                                                <TableRow key={txn.id}>
                                                    <TableCell>{txn.id}</TableCell>
                                                    <TableCell>{`$${txn.amount / 100}`}</TableCell>
                                                    <TableCell>{txn.status}</TableCell>
                                                    <TableCell>{txn.paid ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell>{`$${txn.amount_refunded / 100}`}</TableCell>
                                                    <TableCell>{txn.billing_details?.name ?? 'NA'}</TableCell>
                                                    <TableCell>{new Date(txn.created * 1000).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="secondary" size="small"
                                                            target='blank'
                                                            component={Link}
                                                            to={txn.receipt_url}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>) : (
                                <Typography color="text.secondary" p={1}> No Data found.</Typography>
                            )
                        }
                    </Box>)
                }
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                    <Typography variant="h4" mt={1}>Active Listings</Typography>
                    <Box display="flex" gap={1} >
                        <FormControl sx={{ minWidth: 200 }} size="medium">
                            <InputLabel>Listing Type</InputLabel>
                            <Select
                                value={listingType}
                                label="Listing Type"
                                onChange={(e) => setListing(e.target.value)}
                                sx={{
                                    '&.Mui-focused': {
                                        boxShadow: 'none',
                                        outline: 'none',
                                    },
                                }}
                            >
                                <MenuItem value="marketplace">Market Place</MenuItem>
                                <MenuItem value="sublease">Sublease</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {listingType === "marketplace" ? (
                    isLoadingMarket ? (
                        <Typography color="text.secondary" p={1}>Loading MarketPlace data...</Typography>
                    ) : isErrorMarket ? (
                        <Typography color="error" p={1}>Error loading MarketPlace listings.</Typography>
                    ) : marketData?.marketPlace?.pagination?.totalCount > 0 ? (
                        <>
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
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {marketData?.marketPlace?.data.map((product) => (
                                            <TableRow key={product.marketPlace_id}>
                                                <TableCell>{product.marketPlace_id ?? 'NA'}</TableCell>
                                                <TableCell>{product.title ?? 'NA'}</TableCell>
                                                <TableCell>{product.university ?? 'NA'}</TableCell>
                                                <TableCell>{product.category ?? 'NA'}</TableCell>
                                                <TableCell>{product.price ?? 'NA'}</TableCell>
                                                <TableCell>{product.isbootList === false ? 'No' : 'Yes'}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="secondary" size="small"
                                                        component={Link}
                                                        to={`/dashboard/products/${product.marketPlace_id}`}>
                                                        View
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" size="small" onClick={() => handleMarketDelete(product.marketPlace_id)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Pagination
                                    count={marketData?.marketPlace?.pagination?.totalPages || 0}
                                    page={marketPage}
                                    onChange={(e, value) => setMarketPage(value)}
                                    color="primary"
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography color="text.secondary" p={1}> No Data found.</Typography>
                    )
                ) : (
                    isLoadingSublease ? (
                        <Typography color="text.secondary" p={1}>Loading Sublease data...</Typography>
                    ) : isErrorSublease ? (
                        <Typography color="error" p={1}>Error loading Sublease listings.</Typography>
                    ) : subleaseData?.sublease?.pagination?.totalCount > 0 ? (
                        <>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell><strong>ID</strong></TableCell>
                                            <TableCell><strong>Title</strong></TableCell>
                                            <TableCell><strong>University</strong></TableCell>
                                            <TableCell><strong>category</strong></TableCell>
                                            <TableCell><strong>Price</strong></TableCell>
                                            <TableCell><strong>Boosted</strong></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subleaseData?.sublease?.data.map((sublease) => (
                                            <TableRow key={sublease.sublease_id}>
                                                <TableCell>{sublease.sublease_id ?? 'NA'}</TableCell>
                                                <TableCell>{sublease.title ?? 'NA'}</TableCell>
                                                <TableCell>{sublease.university ?? 'NA'}</TableCell>
                                                <TableCell>{sublease.category ?? 'NA'}</TableCell>
                                                <TableCell>{sublease.price ?? 'NA'}</TableCell>
                                                <TableCell>{sublease.isbootList === false ? 'No' : 'Yes'}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="secondary" size="small"
                                                        component={Link}
                                                        to={`/dashboard/sublease/${sublease.sublease_id}`}>
                                                        View
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" size="small" onClick={() => handleSubleaseDelete(sublease.sublease_id)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Pagination
                                    count={subleaseData?.sublease?.pagination?.totalPages || 0}
                                    page={subleasePage}
                                    onChange={(e, value) => setSubleasePage(value)}
                                    color="primary"
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography color="text.secondary" p={1}> No Data found.</Typography>
                    )
                )}
            </Paper>


        </Box>
    );
}
