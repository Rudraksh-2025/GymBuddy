// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthVerify from 'sections/auth/AuthVerify';

// ================================|| JWT - LOGIN ||================================ //

export default function Verify() {
    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
                        {/* <Typography variant="h3">Verify</Typography> */}
                    </Stack>
                </Grid>
                <Grid size={12}>
                    <AuthVerify />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
}
