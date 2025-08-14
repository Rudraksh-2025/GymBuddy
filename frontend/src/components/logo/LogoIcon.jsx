// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material'
import weightlifter from '../../assets/images/weightlifter.png'
import weightlifter2 from '../../assets/images/weightlifter.svg'
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Mantis" width="100" />
     *
     */

    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2 }}>
        {/* <Typography variant='h3'>Gym Logo</Typography> */}
        <IconButton>
          <img src={weightlifter} alt="" style={{ width: 50, height: 50 }} />
        </IconButton>
      </Box>
    </>


  );
}
