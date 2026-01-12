import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidation } from "../../common/FormValidation";
import { toast } from "react-toastify";
// import { useUserLogin } from "../../API Calls/API";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BootstrapInput } from '../../common/custom/BootsrapInput'
import { useLogin } from "../../Api/Api";

import { Box, Card, Typography, Button, IconButton, FormControl, InputLabel, FormHelperText } from "@mui/material";

import logo3 from "../../assets/images/logo.svg";

const Login = () => {
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginValidation,
        onSubmit: (values) => mutate(values),
    });

    const { mutate } = useLogin();

    return (
        <Box className="loginContainer">
            <Card className='loginCard'>
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

                <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <img src={logo3} alt="logo" style={{ width: "30%" }} />
                </Box>

                <Typography
                    variant="h6"
                    align="center"
                    sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 500,
                        mb: 3,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    Welcome to Gym Buddy
                </Typography>


                <form onSubmit={loginForm.handleSubmit}>

                    <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                        <InputLabel
                            shrink
                            htmlFor="email"
                            className="login-input-label"
                        >
                            Email
                        </InputLabel>

                        <BootstrapInput
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginForm.values.email}
                            onChange={loginForm.handleChange}
                            className="login-textField"
                        />

                        {loginForm.touched.email && (
                            <FormHelperText error>{loginForm.errors.email}</FormHelperText>
                        )}
                    </FormControl>


                    {/* Password */}
                    <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                        <InputLabel
                            shrink
                            htmlFor="password"
                            className="login-input-label"
                        >
                            Password
                        </InputLabel>

                        <BootstrapInput
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginForm.values.password}
                            onChange={loginForm.handleChange}
                            className="login-textField"
                        />

                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: "70%",
                                transform: "translateY(-50%)",
                                color: "white",
                            }}
                            tabIndex={-1}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </IconButton>

                        {loginForm.touched.password && (
                            <FormHelperText error>{loginForm.errors.password}</FormHelperText>
                        )}
                    </FormControl>



                    {/* Forgot Password */}
                    <Box sx={{ textAlign: "right", mb: 3, position: "relative", zIndex: 1 }}>
                        <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                            Don’t have an account?{" "}
                            <Link to="/register" className="link" style={{ color: "#A78BFA" }}>
                                Register
                            </Link>
                        </Typography>
                    </Box>


                    {/* Submit Button */}
                    <Button
                        fullWidth
                        type="submit"
                        className="purple-glosy-btn"
                    >
                        Log In
                    </Button>

                </form>
            </Card>
        </Box>
    );
};

export default Login