import * as yup from 'yup';
const Email = yup.string().required("Email is Required").email("Please Enter a valid Email ID")
const Username = yup.string().required("This is a required field")
const Password = yup.string()
    .required("Password is Required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')

export const userValidationSchema = yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: Email
});

export const loginValidation = yup.object({
    email: Email,
    password: Password,
})
export const profileValidation = yup.object({
    firstName: Username,
    lastName: Username,
    email: Email,

});