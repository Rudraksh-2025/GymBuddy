import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

apiClient.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        const { response } = error;

        if (response && response.status === 400) {
            const errorMessage = response.data.message || response.data || '';
            // if (errorMessage?.toLowerCase().includes('account is already logged in on another device.')) {
            //     console.error('User logged in on another device');
            //     localStorage.removeItem("accessToken");
            //     localStorage.removeItem("refreshToken");
            //     window.location.href = "/";
            // }
        }
        else if (
            error.response &&
            error.response.data &&
            error.response.data.message === "Invalid or expired token"
        ) {
            // Clear auth data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            // Redirect to login page
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default apiClient;
