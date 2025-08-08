import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useGetUserMetrices } from '../../../api/ApiCall';


// project imports
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard() {
  const { data, isLoading } = useGetUserMetrices();
  const activeUsersData = data?.data?.userResponse?.data?.activeUser || {
    daily: [0, 0, 0, 0, 0, 0, 0],
    weekly: [0, 0, 0, 0, 0],
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  const [view, setView] = useState('monthly');

  // Calculate totals
  const totalDaily = activeUsersData.daily.reduce((a, b) => a + b, 0);
  const totalWeekly = activeUsersData.weekly.reduce((a, b) => a + b, 0);
  const totalMonthly = activeUsersData.monthly.reduce((a, b) => a + b, 0);

  const engagementData = {
    daily: { label: 'Daily Active Users', value: totalDaily },
    weekly: { label: 'Weekly Active Users', value: totalWeekly },
    monthly: { label: 'Monthly Active Users', value: totalMonthly }
  };
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" >
        <Grid display={'flex'} gap={2} alignItems={'center'} flexDirection={'row'}>
          <Typography variant="h5" >
            {engagementData[view].label}
          </Typography>
          <Typography variant="h4" color="primary">
            {'[ '}{engagementData[view].value}{' ]'}
          </Typography>
        </Grid>
        <Grid>
          <Stack sx={{ mt: { xs: 2, sm: 0 } }} direction="row" spacing={1} mr={2}>
            {['daily', 'weekly', 'monthly'].map((key) => (
              <Button
                key={key}

                size="small"
                onClick={() => setView(key)}
                color={view === key ? 'primary' : 'secondary'}
                variant={view === key ? 'outlined' : 'text'}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} />
        </Box>
      </MainCard>
    </>
  );
}
