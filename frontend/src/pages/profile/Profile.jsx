import {
  Box,
  Typography,
  Button,
  Grid,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import { profileValidation } from "../../common/FormValidation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile, useUpdateProfile } from "../../Api/Api";
import { toast } from "react-toastify";
import GrayPlus from "../../assets/images/GrayPlus.svg";
import CustomInput from "../../common/custom/CustomInput";
import CloseIcon from "@mui/icons-material/Close";
import CustomSelect from "../../common/custom/CustomSelect";

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

      mutate({ data: formData });
    },
  });

  useEffect(() => {
    if (!profileData?.data) return;

    profileForm.setValues({
      name: profileData.data.name || "",
      email: profileData.data.email || "",
      neckCircumference: profileData.data.neckCircumference || "0",
      waistCircumference: profileData.data.waistCircumference || "0",
      targetWeight: profileData.data.targetWeight || "0",
      profilePhoto: profileData.data.profilePhoto || "",
      age: profileData.data.age || 0,
      height: profileData.data.height || 0,
      weight: profileData.data.weight,
      activityLevel: profileData.data.activityLevel || "",
      goalType: profileData.data.goalType || "",
    });
  }, [profileData?.data]);

  const displayField = (label, value) => (
    <Box mb={3}>
      <Typography
        sx={{ fontSize: "1.1rem", color: "white", fontWeight: 400, mb: 1 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" color="white" sx={{ ml: 0.5 }}>
        {value || "-"}
      </Typography>
    </Box>
  );
  const activityLabels = [
    { label: "Sedentary", value: "sedentary" },
    { label: "Light", value: "light" },
    { label: "Moderate", value: "moderate" },
    { label: "Active", value: "active" },
    { label: "Very Active", value: "very_active" },
  ];
  const selectedActivity = activityLabels.find(
    (item) => item.value === profileForm.values.activityLevel
  );
  const goalTypeLabel = [
    { label: "Fat Loss", value: "fat_loss" },
    { label: "Maintain", value: "maintain" },
    { label: "Muscle Gain", value: "muscle_gain" },
  ];
  const selectedGoalType = goalTypeLabel.find(
    (item) => item.value === profileForm.values.goalType
  );
  return (
    <Box sx={{ p: { xs: 0, sm: 1 } }}>
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",

          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.18)",

          boxShadow: `
      inset 0 0 0.5px rgba(255,255,255,0.6),
      0 12px 40px rgba(0,0,0,0.45)
    `,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <form>
          <Grid container spacing={edit ? 3 : 1}>
            <Grid
              size={12}
              sx={{
                borderBottom: "1px solid #E5E7EB",
                display: "inline-block",
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "white" }}
                gutterBottom
                fontWeight={600}
              >
                Profile Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="User Name"
                  placeholder="Enter your name"
                  name="name"
                  formik={profileForm}
                />
              ) : (
                displayField("User Name", profileForm.values.name)
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Email"
                  placeholder="Email"
                  name="email"
                  formik={profileForm}
                />
              ) : (
                displayField("Email", profileForm.values.email)
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Neck Circumference"
                  placeholder="Enter Neck Circumference(inches)"
                  name="neckCircumference"
                  formik={profileForm}
                />
              ) : (
                displayField(
                  "Neck Circumference",
                  `${profileForm.values.neckCircumference} inches`
                )
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Waist Circumference"
                  placeholder="Enter Waist Circumference(inches)"
                  name="waistCircumference"
                  formik={profileForm}
                />
              ) : (
                displayField(
                  "Waist Circumference",
                  `${profileForm.values.waistCircumference} inches`
                )
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Target Weight"
                  placeholder="Enter Your Target Weight"
                  name="targetWeight"
                  formik={profileForm}
                />
              ) : (
                displayField(
                  "Target Weight",
                  `${profileForm.values.targetWeight} kg`
                )
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Weight"
                  placeholder="Enter Weight (kg)"
                  name="weight"
                  formik={profileForm}
                />
              ) : (
                displayField("Weight", `${profileForm.values.weight} kg`)
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Age"
                  placeholder="Enter Age"
                  name="age"
                  formik={profileForm}
                />
              ) : (
                displayField("Age", `${profileForm.values.age}`)
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomInput
                  label="Height"
                  placeholder="Enter Height (cm)"
                  name="height"
                  formik={profileForm}
                />
              ) : (
                displayField("Height", `${profileForm.values.height} cm`)
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomSelect
                  label="Activity Level"
                  name="activityLevel"
                  value={profileForm.values.activityLevel}
                  onChange={profileForm.handleChange}
                  options={activityLabels}
                  theme="dark"
                />
              ) : (
                displayField("Activity Level", selectedActivity?.label)
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: edit ? 6 : 4 }}>
              {edit ? (
                <CustomSelect
                  label="Goal"
                  name="goalType"
                  value={profileForm.values.goalType}
                  onChange={profileForm.handleChange}
                  options={goalTypeLabel}
                  theme="dark"
                />
              ) : (
                displayField("Goal", selectedGoalType?.label)
              )}
            </Grid>
            {/* images */}
            <Grid size={12}>
              <Grid container gap={4} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <label
                    style={{
                      marginBottom: "10px",
                      display: "block",
                      fontWeight: 500,
                      color: "white",
                    }}
                  >
                    Profile Image
                  </label>

                  <Box
                    sx={{
                      borderRadius: "12px",
                      minHeight: 180,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: edit ? "pointer" : "not-allowed",
                      position: "relative",
                      background: "#404040",
                      border: "2px dotted white",
                    }}
                    component="label"
                  >
                    {/* Remove Button */}
                    {profileForm.values.profilePhoto && edit && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent file picker
                          profileForm.setFieldValue("profilePhoto", "");
                        }}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.8)",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      name="profilePhoto"
                      disabled={!edit}
                      onChange={(e) =>
                        profileForm.setFieldValue(
                          "profilePhoto",
                          e.currentTarget.files[0]
                        )
                      }
                    />

                    {/* Preview */}
                    {profileForm.values.profilePhoto instanceof File ? (
                      <img
                        src={URL.createObjectURL(
                          profileForm.values.profilePhoto
                        )}
                        alt="Profile Preview"
                        style={{
                          height: 200,
                          width: "97%",
                          borderRadius: "12px",
                          objectFit: "contain",
                        }}
                      />
                    ) : profileForm.values.profilePhoto ? (
                      <img
                        src={profileForm.values.profilePhoto}
                        alt="Profile"
                        style={{
                          height: 200,
                          width: "97%",
                          borderRadius: "12px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <>
                        <img src={GrayPlus} alt="upload" />
                        <Typography
                          sx={{ color: "#B0B0B0", fontWeight: 550, mt: 1 }}
                        >
                          Upload
                        </Typography>
                      </>
                    )}
                  </Box>

                  {profileForm.touched.profilePhoto &&
                    profileForm.errors.profilePhoto && (
                      <FormHelperText error>
                        {profileForm.errors.profilePhoto}
                      </FormHelperText>
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
                      sx={{
                        width: 130,
                        height: 48,
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: 400,
                        border: "1px solid #D1D5DB",
                      }}
                      onClick={() => {
                        setedit(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{
                        width: 130,
                        height: 48,
                      }}
                      className="glass-btn"
                      onClick={() => {
                        profileForm.handleSubmit();
                      }}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    className="glass-btn"
                    sx={{height:'40px',width:'100px'}}
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
  name: "",
  neckCircumference: "",
  waistCircumference: "",
  targetWeight: "",
  profilePhoto: "",
  email: "",
  weight: "",
  height: "",
  age: "",
  activityLevel: "",
  goalType: "",
};
