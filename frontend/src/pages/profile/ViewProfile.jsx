import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import { useFormik } from "formik"
import { useUserById, useUpdateUser } from '../../api/ApiCall';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BootstrapInput } from '../../common/BootstrapInput';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { userValidationSchema } from '../../common/FormValidations'

export default function ViewProfile() {
  const [userId, setUserId] = useState(null);
  const [edit, setEdit] = useState(false);
  const client = useQueryClient()
  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem("user"));
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const { data, isLoading, isError } = useUserById(userId);
  const userData = data?.user;
  const submithandler = (values) => {
    setEdit(false);
    const formData = new FormData();

    formData.append("firstName", values.first_name);
    formData.append("lastName", values.last_name);
    formData.append("phoneNumber", values.phone_number);
    formData.append("address", values.address);
    formData.append("street", values.street);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("latitude", values.latitude);
    formData.append("longitude", values.longitude);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    mutate({ userId, data: formData });
  }

  const userform = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      university_name: '',
      phone_number: '',
      image: '',
      address: " ",
      street: " ",
      city: " ",
      state: " ",
      latitude: " ",
      longitude: " ",
    },
    validationSchema: userValidationSchema,
    onSubmit: submithandler
  })

  useEffect(() => {
    if (userData && !edit) {
      userform.setValues({
        first_name: userData.first_name ?? '',
        last_name: userData.last_name ?? '',
        email: userData.email ?? '',
        university_name: userData.university_name ?? '',
        phone_number: userData.phone_number ?? '',
        status: userData.status ? 'Active' : 'Suspended',
        role: userData.role ?? '',
        image: userData.profile_pic ?? '',
        address: userData.address ?? '',
        street: userData.street ?? '',
        city: userData.city ?? '',
        state: userData.state ?? '',
        latitude: userData.latitude ?? '',
        longitude: userData.longitude ?? '',
      });
    }
  }, [userData, edit]);

  const onSuccess = () => {
    client.invalidateQueries(['user', userId]);
    toast.success("User Updated Successfully.");
  }
  const onError = (error) => {
    console.error("Update Error:", error);
    toast.error("Something went Wrong")
  }
  const { mutate } = useUpdateUser(onSuccess, onError)

  const user = data?.user || {};
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load user data</p>;



  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2} justifyContent={'space-between'}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={
                  userform.values.image instanceof File
                    ? URL.createObjectURL(userform.values.image)
                    : userform.values.image
                }
                alt="Profile"
                sx={{ width: 100, height: 100 }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  p: 0.5,
                  "&:hover": { backgroundColor: "#eee" },
                }}
              >
                <PhotoCameraIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      userform.setFieldValue("image", file);
                    }
                  }}
                  disabled={!edit}
                />
              </IconButton>
            </Box>
            <Box ml={2}>
              <Typography variant="h5">
                {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Name not set'}
              </Typography>
              <Typography color="textSecondary">{user.email || 'No email'}</Typography>
            </Box>
          </Box>
          {edit ? (
            <Button variant="contained" color="primary" size="medium" onClick={userform.handleSubmit}>Save
            </Button>
          ) : (
            <Button variant="contained" color="primary" size="medium" onClick={() => setEdit(true)}>
              Edit
            </Button>
          )}
        </Box>

        <Grid container spacing={5} mt={1} display={'flex'} >
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-name">
                First Name:
              </InputLabel>
              <BootstrapInput
                name="first_name"
                id="bootstrap-input-name"
                value={userform.values.first_name}
                onChange={userform.handleChange}
                disabled={!edit}

              />
              {userform.touched.first_name && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.first_name}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-Lastname">
                Last Name:
              </InputLabel>
              <BootstrapInput
                name="last_name"
                id="bootstrap-input-Lastname"
                value={userform.values.last_name}
                onChange={userform.handleChange}
                disabled={!edit}

              />
              {userform.touched.last_name && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.last_name}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-phone">
                Phone:
              </InputLabel>
              <BootstrapInput
                name="phone_number"
                id="bootstrap-input-phone"
                value={userform.values.phone_number}
                disabled={!edit}
                onChange={userform.handleChange}
              />
              {userform.touched.phone_number && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.phone_number}</div>
              )}
            </FormControl>




            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-university">
                University:
              </InputLabel>
              <BootstrapInput
                name="university_name"
                id="bootstrap-input-university"
                value={userform.values.university_name}
                disabled
              />
            </FormControl>


          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>


            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-city">
                City:
              </InputLabel>
              <BootstrapInput
                name="city"
                id="bootstrap-input-city"
                value={userform.values.city}
                disabled={!edit}
                onChange={userform.handleChange}

              />
              {userform.touched.city && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.city}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-state">
                State:
              </InputLabel>
              <BootstrapInput
                name="state"
                id="bootstrap-input-state"
                value={userform.values.state}
                disabled={!edit}
                onChange={userform.handleChange}

              />
              {userform.touched.state && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.state}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-address">
                Address:
              </InputLabel>
              <BootstrapInput
                name="address"
                id="bootstrap-input-address"
                value={userform.values.address}
                disabled={!edit}
                onChange={userform.handleChange}

              />
              {userform.touched.address && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.address}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-street">
                Street:
              </InputLabel>
              <BootstrapInput
                name="street"
                id="bootstrap-input-street"
                value={userform.values.street}
                disabled={!edit}
                onChange={userform.handleChange}

              />
              {userform.touched.street && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.street}</div>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-latitude">
                Latitude:
              </InputLabel>
              <BootstrapInput
                name="latitude"
                id="bootstrap-input-latitude"
                value={userform.values.latitude}
                disabled={!edit}
                onChange={userform.handleChange}

              />
              {userform.touched.latitude && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.latitude}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink htmlFor="bootstrap-input-longitude">
                Longitude:
              </InputLabel>
              <BootstrapInput
                name="longitude"
                id="bootstrap-input-longitude"
                value={userform.values.longitude}
                disabled={!edit}
                onChange={userform.handleChange}

              />
              {userform.touched.longitude && !userform.isSubmitting && (
                <div style={{ color: 'red', fontSize: 12 }}>{userform.errors.longitude}</div>
              )}
            </FormControl>
          </Grid>
        </Grid>

      </CardContent>
    </Card >
  );
}
