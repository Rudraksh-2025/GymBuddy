// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material'
import weightlifter from '../../assets/images/weightlifter.png'
import weightlifter2 from '../../assets/images/weightlifter.svg'
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Mantis" width="100" />
     *
     */
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2, pr: 3 }}>
        {/* <Typography variant='h3'>Gym Logo</Typography> */}
        <IconButton>
          <img src={weightlifter} alt="" style={{ width: 50, height: 50 }} />
        </IconButton>
        <Typography variant='h3'>
          Gym Buddy
        </Typography>
      </Box>

    </>
  );
}
