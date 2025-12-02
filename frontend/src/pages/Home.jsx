import React, { useState } from 'react'
import {
    Box, Typography, Grid,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const Home = () => {

    const PercentageChange = ({ flag, value }) => {
        const isUp = flag === 'up';
        return (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', color: isUp ? '#16A34A' : 'red', fontWeight: 500 }}>
                {isUp ? (
                    <ArrowUpward sx={{ color: '#16A34A', fontSize: 18, mr: 0.3 }} />
                ) : (
                    <ArrowDownward sx={{ color: 'red', fontSize: 18, mr: 0.3 }} />
                )}
                {value || 0}%
                <Typography sx={{ color: '#878787' }}>&nbsp;since last month</Typography>
            </Box>
        );
    };


    return (
        <>
            home
            {/* <Grid container spacing={3} my={5}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#2E86AB33', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Active Subscribers</Typography>
                                <Typography variant="h4" fontWeight={650}>{analyticsData?.data?.totat_active_subscribers?.total_active_subscribers_count || 0}</Typography>

                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.totat_active_subscribers
                                            ?.flag}
                                        value={analyticsData?.data?.totat_active_subscribers
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={activeSubs} alt="ReportIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#4AA96C33', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Weekly Advances Issued</Typography>
                                <Typography variant="h4" fontWeight={650}>R {analyticsData?.data?.total_weekly_advance_issues?.total_weekly_advance_issues || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_weekly_advance_issues
                                            ?.flag}
                                        value={analyticsData?.data?.total_weekly_advance_issues
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={weeklyIssue} alt="LocationIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#1B9AAA33', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Total Repayments</Typography>
                                <Typography variant="h4" fontWeight={650}>R {analyticsData?.data?.total_repayments?.total_repayments || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_repayments
                                            ?.flag}
                                        value={analyticsData?.data?.total_repayments
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={totalRepayment} alt="DangerIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#D7263D33', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Total Outstanding</Typography>
                                <Typography variant="h4" fontWeight={600}>R {analyticsData?.data?.total_outstandings?.total_outstandings || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_outstandings
                                            ?.flag}
                                        value={analyticsData?.data?.total_outstandings
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home1} alt="ReportIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#6C63FF33', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Wallet Balances</Typography>
                                <Typography variant="h4" fontWeight={600}>R {analyticsData?.data?.total_wallet_balance?.total_wallet_balance || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    Available liquidity
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home2} alt="LocationIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <TopUsersCard analyticsData={analyticsData} />
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#ECFDF5', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Total Active Subscriptions</Typography>
                                <Typography variant="h4" fontWeight={600}>{analyticsData?.data?.total_active_subscriptions?.total_active_subscriptions_count || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_active_subscriptions
                                            ?.flag}
                                        value={analyticsData?.data?.total_active_subscriptions
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home3} alt="ReportIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#EFF6FF', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Total Revenue from Subscriptions</Typography>
                                <Typography variant="h4" fontWeight={600}>R {analyticsData?.data?.total_revenue_from_subscription?.total_revenue_from_subscriptions || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_revenue_from_subscription
                                            ?.flag}
                                        value={analyticsData?.data?.total_revenue_from_subscription
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home4} alt="LocationIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#FFF7ED', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Total Expired Subscriptions</Typography>
                                <Typography variant="h4" fontWeight={600}>{analyticsData?.data?.total_expired_subscriptions?.total_expired_subscriptions_count || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_expired_subscriptions
                                            ?.flag}
                                        value={analyticsData?.data?.total_expired_subscriptions
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home5} alt="DangerIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#FEF2F2', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Suspended Subscriptions</Typography>
                                <Typography variant="h4" fontWeight={600}>{analyticsData?.data?.total_suspended_subscription?.total_suspended_subscription_count || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.total_suspended_subscription
                                            ?.flag}
                                        value={analyticsData?.data?.total_suspended_subscription
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home6} alt="ReportIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                    <Box sx={{ height: "100%", backgroundColor: '#ECFEFF', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Upcoming Renewals</Typography>
                                <Typography variant="h4" fontWeight={600}>{analyticsData?.data?.upcoming_renewals?.upcoming_renewals_count || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.upcoming_renewals
                                            ?.flag}
                                        value={analyticsData?.data?.upcoming_renewals
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home7} alt="LocationIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box sx={{ height: "100%", backgroundColor: '#F5F3FF', borderRadius: '16px', }}>
                        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 3, py: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#878787' }}>Average Subscription Value</Typography>
                                <Typography variant="h4" fontWeight={600}>R {analyticsData?.data?.average_subscription_revenue?.averageSubscriptionValueAllTime || 0}</Typography>
                                <Typography variant="body1" sx={{ color: '#878787' }}>
                                    <PercentageChange
                                        flag={analyticsData?.data?.average_subscription_revenue
                                            ?.flag}
                                        value={analyticsData?.data?.average_subscription_revenue
                                            ?.percentage_change}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <img src={home8} alt="DangerIcon" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>

            </Grid> */}
            {/* <Grid container gap={2}>
                <Grid size={{ xs: 12, lg: 5.89 }}>
                    <WeeklyAdvance analyticsData={analyticsData} />
                </Grid>
                <Grid size={{ xs: 12, lg: 5.9 }}>
                    <SubscriberGrowthTrend analyticsData={analyticsData} />
                </Grid>
            </Grid> */}
        </>
    )
}

export default Home
