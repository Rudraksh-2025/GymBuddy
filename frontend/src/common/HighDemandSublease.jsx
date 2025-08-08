// HighDemandSublease.js
import { Box, Card, CardContent, Grid, Typography, Chip, Stack, Button } from '@mui/material';
import { Link } from 'react-router';
export default function HighDemandSublease({ subleases }) {
    console.log(subleases)
    return (
        <Box sx={{ mt: 2 }}>
            {
                Array.isArray(subleases) && subleases.length > 0 &&
                (
                    <> <Typography variant="h5" gutterBottom mb={3}>
                        High Demand Subleases
                    </Typography>
                        <Grid container spacing={2} >
                            {subleases.map((sublease) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sublease.sublease_id}>
                                    <Card variant="outlined" sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                <Typography variant="h4" gutterBottom>{sublease?.title}</Typography>
                                                <Link to={`/dashboard/sublease/${sublease?.sublease_id}`}>
                                                    <Button variant='contained' color='primary'>
                                                        View
                                                    </Button>
                                                </Link>
                                            </Box>
                                            <Typography variant="body1" color="textSecondary">{sublease?.university ?? 'NA'}</Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>{sublease?.description}</Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 1, gap: '5px', flexWrap: 'wrap' }}>
                                                {(() => {
                                                    try {
                                                        const amenities = JSON.parse(sublease?.Amenities || '[]');
                                                        return amenities.map((amenity) => (
                                                            <Chip sx={{ marginBlock: '10px' }} key={amenity} label={amenity} size="small" color="secondary" />
                                                        ));
                                                    } catch (e) {
                                                        console.error("Invalid JSON in Amenities:", sublease.Amenities);
                                                        return null;
                                                    }
                                                })()}
                                            </Stack>
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                Price: <strong>${sublease?.price ?? 0}</strong>
                                            </Typography>
                                            <Typography variant="body1">Number of Rooms: {sublease?.room ?? 0} , Number of Beds: {sublease?.bed ?? 0} , Number of Baths: {sublease?.bath ?? 0}</Typography>
                                            {/* <Typography variant="caption" color="textSecondary">Wishlist Count: {sublease.wishlistCount}</Typography> */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid></>
                )
            }
        </Box>
    );
}
