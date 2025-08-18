import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useVerification } from '../../api/ApiCall';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';



export default function AuthVerify() {
    const { mutate: verify, isLoading } = useVerification();
     const location = useLocation(); 
    return (
        <>
            <Formik
                initialValues={{
                    otp:'',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    code: Yup.string()
                        .required('otp is required')
                        .test('len', 'Code must be exactly 6 digits long', (val) => val?.length === 6)
                })}
                onSubmit={(values, { setSubmitting }) => {
                    verify(
                        {
                            otp:values.code,
                             email: location.state?.email
                        },
                        {
                            onSuccess: () => {
                                toast.success('Verified successful');
                            },
                            onError: (error) => {
                                const errorList = error?.response?.data?.error?.error;

                                if (Array.isArray(errorList)) {
                                    errorList.forEach((err) => {
                                        toast.error(err.message);
                                    });
                                } else {
                                    toast.error(error?.response?.data?.message || 'Something went wrong');
                                }
                            },
                            onSettled: () => {
                                setSubmitting(false);
                            }
                        }
                    );
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="code">Code</InputLabel>
                                    <OutlinedInput
                                        id="code"
                                        type="code"
                                        value={values.code}
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter OTP"
                                        fullWidth
                                        error={Boolean(touched.code && errors.code)}
                                    />
                                </Stack>
                                {touched.code && errors.code && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {errors.code}
                                    </FormHelperText>
                                )}
                            </Grid>

                            {/* <Grid sx={{ mt: -1 }} size={12}>
                                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                                    <Link variant="h6" component={RouterLink} to="#" color="text.primary">
                                        Forgot Password?
                                    </Link>
                                </Stack>
                            </Grid> */}
                            <Grid size={12}>
                                <AnimateButton>
                                    <Button type="submit" sx={{ color: 'white' }} fullWidth size="large" variant="contained" color="primary">
                                        Verify
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik >
        </>
    );
}

AuthVerify.propTypes = { isDemo: PropTypes.bool };
