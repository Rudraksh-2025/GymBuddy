import { useState } from 'react';
// material-ui
// import Avatar from '@mui/material/Avatar';
// import AvatarGroup from '@mui/material/AvatarGroup';
// import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Dialog, DialogTitle, Box, DialogActions, Button } from '@mui/material';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';
// project imports
// import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
// import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
// import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
// import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
// import OrdersTable from 'sections/dashboard/default/OrdersTable';
import HighDemandSublease from '../../common/HighDemandSublease';
// assets
// import GiftOutlined from '@ant-design/icons/GiftOutlined';
// import MessageOutlined from '@ant-design/icons/MessageOutlined';
// import SettingOutlined from '@ant-design/icons/SettingOutlined';

// import avatar1 from 'assets/images/users/avatar-1.png';
// import avatar2 from 'assets/images/users/avatar-2.png';
// import avatar3 from 'assets/images/users/avatar-3.png';
// import avatar4 from 'assets/images/users/avatar-4.png';
// import AdminAnalytics from '../../sections/dashboard/default/AdminAnalytics';
import { useGetUserMetrices } from '../../api/ApiCall';

// avatar style
// const avatarSX = {
//   width: 36,
//   height: 36,
//   fontSize: '1rem'
// };

// action style
// const actionSX = {
//   mt: 0.75,
//   ml: 1,
//   top: 'auto',
//   right: 'auto',
//   alignSelf: 'flex-start',
//   transform: 'none'
// };

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading } = useGetUserMetrices();
  const navigate = useNavigate()
  const activeUsersData = data?.data?.userResponse?.data ?? {};
  const activeProducts = data?.data?.productResponse?.data ?? {}
  const activeSaleAndRevenue = data?.data?.saleAndRevenueResponse?.saleAndRevenueAnalytics ?? {}
  const topPriceRange = activeProducts?.priceRange?.reduce((max, current) =>
    current.count > (max?.count ?? 0) ? current : max,
    null
  );
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/NewActiveUsers')}>
        <AnalyticEcommerce title="New Signups" color="success" count={activeUsersData.newSignupCount ?? 0} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <AnalyticEcommerce
          title="Most engaged university"
          count={activeUsersData.mostEngagedUniversities?.length > 0 ? activeUsersData.mostEngagedUniversities?.[0] : 'No data'}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ cursor: 'pointer' }} onClick={handleOpenModal}>
        <AnalyticEcommerce
          title="Most searched category"
          count={activeProducts.searchMostCategory?.length > 0 ? activeProducts.searchMostCategory?.[0] : 'No data'}
        />
      </Grid>
      {/* modal */}


      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs">
        <DialogTitle backgroundColor={'rgba(250, 140, 22, 0.9)'} textAlign={'center'} color="white" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          Most Searched Category
        </DialogTitle>
        <Box  >
          {activeProducts.searchMostCategory?.length > 0 ? (
            activeProducts.searchMostCategory.slice(0, 3).map((cat, index) => (
              <Typography key={index} variant='h5' sx={{ py: 1.5, px: 3, backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>{index + 1} &nbsp; {cat}</Typography>
            ))
          ) : (
            <Typography sx={{ p: 1 }} textAlign={'center'}>No category data available.</Typography>
          )}
        </Box>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" backgroundColor>
        <DialogTitle >
          <Typography variant="h4" color="black" textAlign={'center'}>Most Searched Category</Typography>
        </DialogTitle>
        <Box px={0}>
          {activeProducts.searchMostCategory?.length > 0 ? (
            activeProducts.searchMostCategory.slice(0, 3).map((cat, index) => (
              <Typography key={index} color='#424242' variant='h5' sx={{ py: 1.5, px: 3, borderBottom: '0.5px solid #424242', backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }} >{index + 1} &nbsp; {cat}</Typography>
            ))
          ) : (
            <Typography>No category data available.</Typography>
          )}
        </Box>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog> */}


      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 8 }}>
        <UniqueVisitorCard />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: { xs: 0, sm: 0 } }} display={'flex'} flexDirection={'column'} gap={2}>
        <Grid size={{ xs: 12 }} >
          <AnalyticEcommerce title="Average Selling Price" count={`$${activeSaleAndRevenue.averageSellingPrice?.toFixed(2) ?? 0}`} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticEcommerce
            title="Top Price Range"
            count={topPriceRange ? `$${topPriceRange.range}` : 'No data'}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>

          <AnalyticEcommerce
            title="Total Transaction Revenue"
            count={`$${activeSaleAndRevenue.totalRevenueFromFees?.toFixed(2) ?? 0}`}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticEcommerce title="Total Sales Volume" count={`$${activeSaleAndRevenue.totalSalesVolume ?? 0}`} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticEcommerce title="Boosted Listing Revenue" count={`$${activeSaleAndRevenue.revenueFromBoostedListings ?? 0}`} />
        </Grid>

      </Grid>
      <Grid size={{ xs: 12 }}>
        <HighDemandSublease subleases={activeProducts?.highDemandSublease ?? []} />
      </Grid>
      {/* <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid> */}
      {/* row 3 */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid> */}
      {/* <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid> */}
      {/* row 4 */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid> */}
      {/* <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                px: 2,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
            </ListItem>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid> */}
    </Grid>
  );
}
