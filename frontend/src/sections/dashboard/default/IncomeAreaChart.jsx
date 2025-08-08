import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { LineChart } from '@mui/x-charts/LineChart';
import { useGetUserMetrices } from '../../../api/ApiCall';

// Labels
const dailyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeklyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



function Legend({ items, onToggle }) {
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: item.visible ? item.color : 'grey.500',
              borderRadius: '50%'
            }}
          />
          <Typography variant="body2" color="text.primary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function IncomeAreaChart({ view }) {
  const theme = useTheme();

  const [visibility, setVisibility] = useState({
    'Active Users': true,
    // Signups: true
  });
  const { data, isLoading } = useGetUserMetrices();
  const activeUsersData = data?.data?.userResponse?.data?.activeUser || {
    daily: [0, 0, 0, 0, 0, 0, 0],
    weekly: [0, 0, 0, 0, 0],
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
  // Set labels and data based on view
  let labels, data1;
  switch (view) {
    case 'daily':
      labels = dailyLabels;
      data1 = activeUsersData.daily;
      // data2 = dailySignups;
      break;
    case 'weekly':
      labels = weeklyLabels;
      data1 = activeUsersData.weekly;
      // data2 = weeklySignups;
      break;
    case 'monthly':
    default:
      labels = monthlyLabels;
      data1 = activeUsersData.monthly;
      // data2 = monthlySignups;
      break;
  }

  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: 'Active Users',
      showMark: false,
      area: true,
      id: 'ActiveUsers',
      color: theme.palette.primary.main,
      visible: visibility['Active Users']
    },
    // {
    //   data: data2,
    //   label: 'Signups',
    //   showMark: false,
    //   area: true,
    //   id: 'Signups',
    //   color: theme.palette.primary[700],
    //   visible: visibility['Signups']
    // }
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <>
      <LineChart
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[
          {
            scaleType: 'point',
            data: labels,
            disableLine: true,
            tickLabelStyle: axisFontStyle
          }
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: axisFontStyle
          }
        ]}
        height={440}
        margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
        series={visibleSeries
          .filter((series) => series.visible)
          .map((series) => ({
            type: 'line',
            data: series.data,
            label: series.label,
            showMark: series.showMark,
            area: series.area,
            id: series.id,
            color: series.color,
            stroke: series.color,
            strokeWidth: 2
          }))}
        sx={{
          '& .MuiAreaElement-series-ActiveUsers': {
            fill: "url('#gradientActiveUsers')",
            strokeWidth: 2,
            opacity: 0.8
          },
          '& .MuiAreaElement-series-Signups': {
            fill: "url('#gradientSignups')",
            strokeWidth: 2,
            opacity: 0.8
          },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': {
            stroke: theme.palette.divider
          }
        }}
      >
        <defs>
          <linearGradient id="gradientActiveUsers" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
          <linearGradient id="gradientSignups" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary[700], 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>
      <Legend items={visibleSeries} onToggle={toggleVisibility} />
    </>
  );
}

Legend.propTypes = {
  items: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired
};

IncomeAreaChart.propTypes = {
  view: PropTypes.oneOf(['daily', 'weekly', 'monthly']).isRequired
};
