import {
    Box, Typography, Button, Grid, FormHelperText
} from "@mui/material";
import { useFormik } from "formik";
import { profileValidation } from "../../common/FormValidation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile, useUpdateProfile } from "../../Api/Api";
import { toast } from "react-toastify";
import GrayPlus from '../../assets/images/GrayPlus.svg'
import CustomInput from "../../common/custom/CustomInput";
const Profile = () => {
    const [edit, setedit] = useState(false);
    const client = useQueryClient();

    const onSuccess = () => {
        toast.success("Profile Updated Successfully.");
        client.invalidateQueries("profile");
    };
    const onError = (error) => {
        toast.error(error.response.data.message || "Something went Wrong");
    };

    const { mutate } = useUpdateProfile(onSuccess, onError);
    const { data: profileData } = useGetProfile();

    const profileForm = useFormik({
        initialValues: super_admin,
        validationSchema: profileValidation,
        onSubmit: (values) => {
            setedit(false);
            const formData = new FormData();


            Object.keys(values).forEach((key) => {
                if (key !== "profilePhoto") {
                    formData.append(key, values[key]);
                }
            });

            if (values.profilePhoto && values.profilePhoto instanceof File) {
                formData.append("profilePhoto", values.profilePhoto);
            }

            mutate({data: formData });
        },

    });


useEffect(() => {
  if (!profileData?.data) return;

  profileForm.setValues({
    firstName: profileData.data.firstName || "",
    lastName: profileData.data.lastName || "",
    email: profileData.data.email || "",
    neckCircumference:profileData.data.neckCircumference || "0",
    waistCircumference:profileData.data.waistCircumference || "0",
    targetWeight:profileData.data.targetWeight || "0",
    profilePhoto: profileData.data.profilePhoto || "",
  });
}, [profileData?.data]);



    const displayField = (label, value) => (
        <Box mb={3}>
            <Typography sx={{ fontSize: '1.1rem', color: 'white', fontWeight: 400, mb: 1 }}>{label}</Typography>
            <Typography variant="body1" color="white" sx={{ ml: 0.5 }}>
                {value || "-"}
            </Typography>
        </Box>
    );
    return (
        <Box sx={{ p: { xs: 0, sm: 1 } }}>
            <Box sx={{ backgroundColor: "#404040", p: 3, borderRadius: '10px', boxShadow: "-3px 4px 23px rgba(0, 0, 0, 0.1)", mb: 3 }}>
                <form>
                    <Grid container spacing={edit ? 3 : 1}>
                        <Grid size={12} sx={{
                            borderBottom: "1px solid #E5E7EB",
                            display: "inline-block",
                            paddingBottom: "4px",
                            marginBottom: "10px"
                        }}>
                            <Typography variant="h6" sx={{ color: 'white' }} gutterBottom fontWeight={600}>
                                Profile Information
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
                            {edit ? (
                                <CustomInput
                                    label="First Name"
                                    placeholder="First Name"
                                    name="firstName"
                                    formik={profileForm}
                                />
                            ) : displayField("First Name", profileForm.values.firstName)}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
                            {edit ? (
                                <CustomInput
                                    label="Last Name"
                                    placeholder="Last Name"
                                    name="lastName"
                                    formik={profileForm}
                                />
                            ) : displayField("Last Name", profileForm.values.lastName)}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
                            {edit ? (
                                <CustomInput
                                    label="Email"
                                    placeholder="Email"
                                    name="email"
                                    formik={profileForm}
                                />
                            ) : displayField("Email", profileForm.values.email)}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
                            {edit ? (
                                <CustomInput
                                    label="Neck Circumference"
                                    placeholder="Enter Neck Circumference(inches)"
                                    name="neckCircumference"
                                    formik={profileForm}
                                />
                            ) : displayField("Neck Circumference", `${profileForm.values.neckCircumference} inches`)}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
                            {edit ? (
                                <CustomInput
                                    label="Waist Circumference"
                                    placeholder="Enter Waist Circumference(inches)"
                                    name="waistCircumference"
                                    formik={profileForm}
                                />
                            ) : displayField("Waist Circumference", `${profileForm.values.waistCircumference} inches`)}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
                            {edit ? (
                                <CustomInput
                                    label="Target Weight"
                                    placeholder="Enter Your Target Weight"
                                    name="targetWeight"
                                    formik={profileForm}
                                />
                            ) : displayField("Target Weight", `${profileForm.values.targetWeight} kg`)}
                        </Grid>


                        {/* images */}
                        <Grid size={12}>
                            <Grid container gap={4} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
                                    <label style={{ marginBottom: '10px', display: 'block', fontWeight: 500, color: 'white' }}>Profile Image</label>
                                    <Box
                                        sx={{
                                            borderRadius: '12px',
                                            minHeight: 180,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: edit ? 'pointer' : 'not-allowed',
                                            position: 'relative',
                                            background: '#fafbfc'
                                        }}
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            name="profilePhoto"
                                            disabled={!edit}
                                            onChange={e => profileForm.setFieldValue('profilePhoto', e.currentTarget.files[0])}
                                        />
                                        {profileForm.values.profilePhoto instanceof File ? (
                                            <img
                                                src={URL.createObjectURL(profileForm.values.profilePhoto)}
                                                alt="Selfie Preview"
                                                style={{ height: 200, width: '100%', objectFit: 'contain', marginBottom: 8 }}
                                            />
                                        ) : profileForm.values.profilePhoto ? (
                                            <img
                                                src={profileForm.values.profilePhoto}
                                                alt="Selfie"
                                                style={{ height: 200, width: '100%', objectFit: 'contain', marginBottom: 8 }}
                                            />
                                        ) : (<><img src={GrayPlus} alt="gray plus" />
                                            <Typography sx={{ color: '#B0B0B0', fontWeight: 550, mt: 1 }}>Upload</Typography></>
                                        )}
                                    </Box>
                                    {profileForm.touched.profilePhoto && profileForm.errors.profilePhoto && (
                                        <FormHelperText error>{profileForm.errors.profilePhoto}</FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* save /edit button */}
                        <Grid size={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                {edit ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            sx={{ width: 130, height: 48, borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: 400, border: '1px solid #D1D5DB' }}
                                            onClick={() => {
                                                setedit(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ width: 130, height: 48, borderRadius: '8px', color: 'white', backgroundColor: 'var(--Blue)', fontSize: '16px', fontWeight: 400, }}
                                            onClick={() => {
                                                profileForm.handleSubmit()
                                            }}
                                        >
                                            Save
                                        </Button>

                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{ width: 130, height: 48, color: 'white', borderRadius: '10px', backgroundColor: 'var(--Blue)' }}
                                        onClick={() => setedit(true)}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </Box>
                        </Grid>

                    </Grid>
                </form>
            </Box>
        </Box>
    );
};

export default Profile;

const super_admin = {
    firstName: "",
    lastName: "",
    email: "",
};
