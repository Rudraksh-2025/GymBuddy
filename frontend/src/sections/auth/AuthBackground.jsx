// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="6.5"
              numOctaves="3"
              stitchTiles="stitch" />
          </filter>
        </defs>
        <g opacity="0.7">
          <circle cx="120" cy="150" r="180" fill="#0099ff" />
          <circle cx="350" cy="320" r="160" fill="#4c00ff" />
          <circle cx="380" cy="100" r="120" fill="#00c3ff" />
          <rect x="0" y="0" width="100%" height="100%" filter="url(#noiseFilter)" />
        </g>
      </svg>
    </Box>
  );
}
