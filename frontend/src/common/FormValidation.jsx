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
export const RegisterValidation = yup.object({
    email: Email,
    name: yup.string().required('Name is required'),
    password: Password,
    height: yup.number().required('Height is required'),
    gender: yup.string().required("Gender is required")
})
export const profileValidation = yup.object({
    name: Username,
    email: Email,
});

export const foodValidation = yup.object({
    name: yup.string().required('Name is required'),
    servingSize: yup.string().required('Serving Size is required'),
    calories: yup.number().required("Calories are required"),
    fats: yup.number().required('Fats is required'),
    carbs: yup.number().required('Carbs are required'),
    protein: yup.number().required('Protein is required')
})