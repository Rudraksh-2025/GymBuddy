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

import CustomSelect from '../../common/custom/CustomSelect'

import logo3 from "../../assets/images/logo.svg";

const Register = () => {
    const [step, setStep] = useState(1);

    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loginForm = useFormik({
        initialValues: {
            email: "",
            name: "",
            password: "",
            height: "",
            weight: "",
            age: "",
            gender: "",
            activityLevel: "",
            goalType: "",
        },
        validationSchema: RegisterValidation,
        onSubmit: (values) => mutate(values),
    });

    const { mutate } = useRegister();

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
                    align="center"
                    sx={{ color: "rgba(255,255,255,0.8)", my: 1, fontSize: 15 }}
                >
                    Step {step} of 2
                </Typography>


                <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 450, mb: 2 }}
                >
                    Welcome to Gym Buddy
                </Typography>

                <form onSubmit={loginForm.handleSubmit}>
                    {step === 1 && (
                        <>
                            {/* Name */}
                            <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                                <InputLabel shrink htmlFor='name' className="login-input-label">Name</InputLabel>
                                <BootstrapInput
                                    name="name"
                                    value={loginForm.values.name}
                                    onChange={loginForm.handleChange}
                                    placeholder="Your name"
                                    className="login-textField"
                                />
                                {loginForm.touched.name && (
                                    <FormHelperText error>{loginForm.errors.name}</FormHelperText>
                                )}
                            </FormControl>

                            {/* Email */}
                            <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                                <InputLabel shrink htmlFor='email' className="login-input-label">Email</InputLabel>
                                <BootstrapInput
                                    name="email"
                                    value={loginForm.values.email}
                                    onChange={loginForm.handleChange}
                                    placeholder="Email address"
                                    className="login-textField"
                                />
                                {loginForm.touched.email && (
                                    <FormHelperText error>{loginForm.errors.email}</FormHelperText>
                                )}
                            </FormControl>

                            {/* Password */}
                            <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                                <InputLabel shrink htmlFor='password' className="login-input-label">Password</InputLabel>
                                <BootstrapInput
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={loginForm.values.password}
                                    onChange={loginForm.handleChange}
                                    placeholder="Password"
                                    className="login-textField"
                                />
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    sx={{ position: "absolute", right: 8, top: "45%", color: "white" }}
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </IconButton>
                            </FormControl>

                            {/* NEXT BUTTON */}
                            <Button
                                fullWidth
                                className="purple-glosy-btn"
                                onClick={() => setStep(2)}
                            >
                                Next
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>

                                <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                                    <InputLabel shrink htmlFor='height' className="login-input-label">Height</InputLabel>
                                    <BootstrapInput
                                        name="height"
                                        type="number"
                                        placeholder="Height (cm)"
                                        value={loginForm.values.height}
                                        className="login-textField"
                                        onChange={loginForm.handleChange}
                                    />
                                    {loginForm.touched.height && (
                                        <FormHelperText error>{loginForm.errors.height}</FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                                    <InputLabel shrink htmlFor='weight' className="login-input-label">Weight</InputLabel>
                                    <BootstrapInput
                                        name="weight"
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={loginForm.values.weight}
                                        onChange={loginForm.handleChange}
                                        className="login-textField"
                                    />

                                    {loginForm.touched.weight && (
                                        <FormHelperText error>{loginForm.errors.weight}</FormHelperText>
                                    )}
                                </FormControl>


                            </Box>

                            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                <FormControl variant="standard" fullWidth sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                                    <InputLabel shrink htmlFor='age' className="login-input-label">Age</InputLabel>
                                    <BootstrapInput
                                        name="age"
                                        placeholder="Age"
                                        type="number"
                                        value={loginForm.values.age}
                                        className="login-textField"
                                        onChange={loginForm.handleChange}
                                    />

                                    {loginForm.touched.age && (
                                        <FormHelperText error>{loginForm.errors.age}</FormHelperText>
                                    )}
                                </FormControl>
                                <CustomSelect
                                    label="Gender"
                                    name="gender"
                                    theme="dark"
                                    value={loginForm.values.gender}
                                    onChange={loginForm.handleChange}
                                    options={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                    ]}
                                />
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                <CustomSelect
                                    label="Activity Level"
                                    name="activityLevel"
                                    value={loginForm.values.activityLevel}
                                    theme="dark"
                                    onChange={loginForm.handleChange}
                                    options={[
                                        { label: "Sedentary", value: "sedentary" },
                                        { label: "Light", value: "light" },
                                        { label: "Moderate", value: "moderate" },
                                        { label: "Active", value: "active" },
                                        { label: "Very Active", value: "very_active" },
                                    ]}
                                />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <CustomSelect
                                    label="Goal"
                                    name="goalType"
                                    theme="dark"
                                    value={loginForm.values.goalType}
                                    onChange={loginForm.handleChange}
                                    options={[
                                        { label: "Fat Loss", value: "fat_loss" },
                                        { label: "Maintain", value: "maintain" },
                                        { label: "Muscle Gain", value: "muscle_gain" },
                                    ]}
                                />
                            </Box>
                            <Box sx={{ textAlign: "right", mt: 2, position: "relative", zIndex: 1 }}>
                                <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                                    Already have an account?{" "}
                                    <Link to="/" className="link" style={{ color: "#A78BFA" }}>
                                        Login
                                    </Link>
                                </Typography>
                            </Box>

                            {/* BACK + REGISTER */}
                            <Box display="flex" gap={2} mt={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        color: "white", borderColor: "white", marginTop: '8px',
                                        paddingBlock: "10px",
                                        borderRadius: "14px"
                                    }}
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>

                                <Button
                                    fullWidth
                                    type="submit"
                                    className="purple-glosy-btn"
                                >
                                    Register
                                </Button>
                            </Box>
                        </>
                    )}
                </form>
            </Card>
        </Box>
    );
};

export default Register