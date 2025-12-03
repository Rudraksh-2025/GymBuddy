import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BootstrapInput } from '../../common/custom/BootsrapInput'
import { useVerification } from "../../api/Api";

import { Box, Card, Typography, TextField, Button, IconButton, InputAdornment, FormControl, InputLabel, FormHelperText } from "@mui/material";

import logo3 from "../../assets/images/logo.svg";

const Verification = () => {
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const email = location.state?.email || ""

    const loginForm = useFormik({
        initialValues: {
            otp: "",
            email: email
        },
        onSubmit: (values) => mutate(values),
    });



    const { mutate } = useVerification();

    return (
        <Box
            sx={{
                minHeight: "95vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "var(--DarkBlue)",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                p: 3
            }}
        >
            <Card
                sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 3,
                    maxWidth: 450,
                    width: "100%",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <img src={logo3} alt="logo" style={{ width: "30%" }} />
                </Box>

                <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "#878787", fontWeight: 450, mb: 3 }}
                >
                    Welcome to Gym Buddy
                </Typography>

                <form onSubmit={loginForm.handleSubmit}>
                    {/* otp */}
                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                        <InputLabel shrink htmlFor="otp" sx={{ fontSize: '1.3rem', fontWeight: 500, color: 'rgba(0, 0, 0, 0.8)', '&.Mui-focused': { color: 'black' } }}>
                            Otp
                        </InputLabel>
                        <BootstrapInput
                            id="otp"
                            name="otp"
                            placeholder="Enter 6 digit code"
                            value={loginForm.values.otp}
                            onChange={loginForm.handleChange}
                        />
                        {loginForm.touched.otp && <FormHelperText error>{loginForm.errors.otp}</FormHelperText>}
                    </FormControl>




                    {/* Forgot Password */}
                    {/* <Box sx={{ textAlign: "right", mb: 3 }}>
                        <Typography
                            component="a"
                            href="#"
                            sx={{ fontSize: "0.9rem", color: "var(--Blue)", textDecoration: "none" }}
                        >
                            Forgot Password?
                        </Typography>
                    </Box> */}

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        type="submit"
                        sx={{
                            bgcolor: "var(--DarkBlue)",
                            fontWeight: 700,
                            borderRadius: 2,
                            py: 1.5,
                            color: "white",
                            "&:hover": { bgcolor: "var(--DarkBlue)" },
                        }}
                    >
                        Verify
                    </Button>
                </form>
            </Card>
        </Box>
    );
};

export default Verification