import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BootstrapInput } from '../../common/custom/BootsrapInput'
import { useVerification } from "../../Api/Api";

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
        <Box className='loginContainer'>
            <Card className="loginCard">
                {/* glossy overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(120deg, rgba(255,255,255,0.25), transparent 60%)",
                        pointerEvents: "none",
                    }}
                />
                <Box sx={{ textAlign: "center" }}>
                    <img src={logo3} alt="logo" style={{ width: "30%" }} />
                </Box>

                <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 450, mb: 2 }}
                >
                    Welcome to Gym Buddy
                </Typography>

                <form onSubmit={loginForm.handleSubmit}>
                    {/* otp */}
                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                        <InputLabel shrink htmlFor='otp' className="login-input-label">
                            Otp
                        </InputLabel>
                        <BootstrapInput
                            id="otp"
                            name="otp"
                            placeholder="Enter 6 digit code"
                            value={loginForm.values.otp}
                            onChange={loginForm.handleChange}
                            className="login-textField"
                        />
                        {loginForm.touched.otp && <FormHelperText error>{loginForm.errors.otp}</FormHelperText>}
                    </FormControl>


                    {/* Submit Button */}
                    <Button
                        fullWidth
                        type="submit"
                        className="purple-glosy-btn"
                    >
                        Verify
                    </Button>
                </form>
            </Card>
        </Box>
    );
};

export default Verification