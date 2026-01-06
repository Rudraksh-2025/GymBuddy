import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2A8EFB',
        },
    },
    typography: {
        fontFamily: '"Montserrat", "sans-serif"',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontFamily: '"Montserrat", "sans-serif"',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: '"Montserrat", "sans-serif"',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--icon-gray)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--icon-gray)',
                    },
                },
                notchedOutline: {
                    borderColor: 'var(--icon-gray)',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: '#000000', // black color on focus
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#878787',
                    '&.Mui-selected': {
                        color: '#2A8EFB',
                    },
                },
            },
        },
    },
});

export default theme;