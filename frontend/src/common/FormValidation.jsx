import * as Yup from 'yup';

export const userValidationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    phone_number: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        // .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),

    address: Yup.string().required('Address is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    latitude: Yup.number()
        .typeError('Latitude must be a number')
        .required('Latitude is required'),

    longitude: Yup.number()
        .typeError('Longitude must be a number')
        .required('Longitude is required'),
});