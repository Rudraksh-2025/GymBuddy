import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { RegisterValidation } from "../../common/FormValidation";
import { toast } from "react-toastify";
// import { useUserLogin } from "../../API Calls/API";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BootstrapInput } from '../../common/custom/BootsrapInput'
import { useRegister } from "../../Api/Api";

import { Box, Card, Typography, Button, IconButton, FormControl, InputLabel, FormHelperText } from "@mui/material";

import logo3 from "../../assets/images/logo.svg";

const Register = () => {
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loginForm = useFormik({
        initialValues: {
            email: "",
            name: "",
            password: "",
        },
        validationSchema: RegisterValidation,
        onSubmit: (values) => mutate(values),
    });

    const { mutate } = useRegister();

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
                    {/* Name */}
                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                        <InputLabel shrink htmlFor="name" sx={{ fontSize: '1.3rem', fontWeight: 500, color: 'rgba(0, 0, 0, 0.8)', '&.Mui-focused': { color: 'black' } }}>
                            Name
                        </InputLabel>
                        <BootstrapInput
                            id="name"
                            name="name"
                            placeholder="Enter your Name"
                            value={loginForm.values.name}
                            onChange={loginForm.handleChange}
                        />
                        {loginForm.touched.name && <FormHelperText error>{loginForm.errors.name}</FormHelperText>}
                    </FormControl>
                    {/* Email */}
                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                        <InputLabel shrink htmlFor="email" sx={{ fontSize: '1.3rem', fontWeight: 500, color: 'rgba(0, 0, 0, 0.8)', '&.Mui-focused': { color: 'black' } }}>
                            Email or Username
                        </InputLabel>
                        <BootstrapInput
                            id="email"
                            name="email"
                            placeholder="Enter your email or username"
                            value={loginForm.values.email}
                            onChange={loginForm.handleChange}
                        />
                        {loginForm.touched.email && <FormHelperText error>{loginForm.errors.email}</FormHelperText>}
                    </FormControl>

                    {/* Password */}
                    <FormControl variant="standard" fullWidth sx={{ mb: 2, position: 'relative' }}>
                        <InputLabel shrink htmlFor="password" sx={{ fontSize: '1.3rem', fontWeight: 500, color: 'rgba(0, 0, 0, 0.8)', '&.Mui-focused': { color: 'black' } }}>
                            Password
                        </InputLabel>
                        <BootstrapInput
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginForm.values.password}
                            onChange={loginForm.handleChange}

                        />
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: 8,
                                top: '70%',
                                transform: 'translateY(-50%)',
                                padding: 0,
                                zIndex: 2
                            }}
                            tabIndex={-1}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </IconButton>
                        {loginForm.touched.password && <FormHelperText error>{loginForm.errors.password}</FormHelperText>}
                    </FormControl>


                    {/* Forgot Password */}
                    <Box sx={{ textAlign: "right", mb: 3 }}>
                        <Typography
                            component="a"
                            href="#"
                            sx={{ fontSize: "0.9rem", color: "black", textDecoration: "none" }}
                        >
                            Already have an account? <Link to='/' className='link'>Login</Link>
                        </Typography>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        // variant="contained"
                        type="submit"
                        // disabled={loginfn.isPending}
                        sx={{
                            bgcolor: "var(--DarkBlue)",
                            fontWeight: 700,
                            borderRadius: 2,
                            py: 1.5,
                            color: "white",
                            "&:hover": { bgcolor: "var(--DarkBlue)" },
                        }}
                    >
                        {/* {loginfn.isPending ? <Loader color="white" /> : "Log In"} */}
                        Register
                    </Button>
                </form>
            </Card>
        </Box>
    );
};

export default Register