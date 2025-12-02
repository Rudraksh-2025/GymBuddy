// import React from 'react';
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'

import App from './App.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ToastContainer />
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </>
  // </React.StrictMode>,
)