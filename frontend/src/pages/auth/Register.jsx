import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidation } from "../../common/FormValidation";
import { toast } from "react-toastify";
// import { useUserLogin } from "../../API Calls/API";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BootstrapInput } from '../../common/custom/BootsrapInput'
import { useRegister } from "../../api/Api";

import { Box, Card, Typography, Button, IconButton, FormControl, InputLabel, FormHelperText } from "@mui/material";

import logo3 from "../../assets/images/logo.svg";

const Register = () => {
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
            fcm_token: "fcm_token",
        },
        validationSchema: loginValidation,
        onSubmit: (values) => mutate(values),
    });

    const onError = (error) => {
        toast.error(error?.message || "Something went wrong");
    };

    const onSuccess = (res) => {
        toast.success("Logged In successfully.");
        localStorage.clear();
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userID", res.data.user.id);
        localStorage.setItem("userName", res.data.user.firstName);
        localStorage.setItem("role", res.data.user.Role.name);
        localStorage.setItem("profileImg", res.data.user.profile_img)
        nav("/home");
    };

    const { mutate } = useRegister(onSuccess, onError);

    return (
        <Box
            sx={{
                minHeight: "95vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "var(--Blue)",
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
                    variant="body1"
                    align="center"
                    sx={{ color: "#878787", fontWeight: 400, mb: 3 }}
                >
                    Welcome to Gym Buddy
                </Typography>

                <form onSubmit={loginForm.handleSubmit}>
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
                            sx={{ fontSize: "0.9rem", color: "var(--Blue)", textDecoration: "none" }}
                        >
                            Already have an account? <Link to='/login'>Login</Link>
                        </Typography>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        // variant="contained"
                        type="submit"
                        // disabled={loginfn.isPending}
                        sx={{
                            bgcolor: "var(--Blue)",
                            fontWeight: 700,
                            borderRadius: 2,
                            py: 1.5,
                            color: "white",
                            "&:hover": { bgcolor: "var(--Blue)" },
                        }}
                    >
                        {/* {loginfn.isPending ? <Loader color="white" /> : "Log In"} */}
                        Log In
                    </Button>
                </form>
            </Card>
        </Box>
    );
};

export default Register