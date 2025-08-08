import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";


const AdminAnalytics = () => {
    const analyticsData = {
        userEngagement: {
            dailyActive: 1200,
            weeklyActive: 5200,
            monthlyActive: 18900,
            newSignups: 340,
            topUniversities: ['Stanford', 'MIT', 'UCLA'],
        },
        salesRevenue: {
            transactionRevenue: 12000,
            boostedListingRevenue: 3000,
            totalSalesVolume: 430,
            avgSellingPrice: 58,
        },
        productSublease: {
            topCategories: ['Laptops', 'Furniture', 'Books'],
            popularPriceRanges: ['₹500-₹1000', '₹1000-₹2000'],
            topSubleases: ['2BHK near NYU', 'Studio near MIT', '1BHK near UCLA'],
        },
    };
    const { userEngagement, salesRevenue, productSublease } = analyticsData;

    const renderCard = (title, value) => (
        <Card sx={{ minWidth: 200, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                    {title}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Grid container spacing={3}>
            {/* User Engagement */}
            <Grid size={12}>
                <Typography variant="h5">User Engagement Metrics</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }} >{renderCard("Daily Active Users", userEngagement.dailyActive)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Weekly Active Users", userEngagement.weeklyActive)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Monthly Active Users", userEngagement.monthlyActive)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("New Signups", userEngagement.newSignups)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Top Universities", userEngagement.topUniversities.join(", "))}</Grid>

            {/* Sales & Revenue */}
            <Grid size={12}>
                <Typography variant="h5">Sales & Revenue Analytics</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Transaction Revenue", `₹${salesRevenue.transactionRevenue}`)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Boosted Listing Revenue", `₹${salesRevenue.boostedListingRevenue}`)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Total Sales Volume", salesRevenue.totalSalesVolume)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Avg Selling Price", `₹${salesRevenue.avgSellingPrice}`)}</Grid>

            {/* Product & Sublease */}
            <Grid size={12}>
                <Typography variant="h5">Product & Sublease Insights</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Top Categories", productSublease.topCategories.join(", "))}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Popular Price Ranges", productSublease.popularPriceRanges.join(", "))}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{renderCard("Top Subleases", productSublease.topSubleases.join(", "))}</Grid>
        </Grid>
    );
};

export default AdminAnalytics;
