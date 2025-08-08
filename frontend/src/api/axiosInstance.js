// src/utils/axiosInstance.js
import axios from 'axios';
import { getToken } from '../utils/auth';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    // withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = getToken('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
