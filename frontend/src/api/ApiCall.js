/* eslint-disable react-hooks/exhaustive-deps */
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { saveToken, removeToken } from '../utils/auth';
import { useNavigate } from "react-router-dom";
import axiosInstance from './axiosInstance';
import { toast } from 'react-toastify';
// --------------------------------------------------- CUSTOM HOOKS ---------------------------------------------------

// get list of user
export const useUsers = (page = 1, limit = 2, searchKey = '') => {
    return useQuery({
        queryKey: ['users', page, limit, searchKey],
        queryFn: async () => {
            const response = await axiosInstance.get('/auth/getAllUser', {
                params: { page, limit, searchKey },
            });
            return response.data;
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};
//  Get user by ID
export const useUserById = (userId) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/auth/${userId}`);
            return data;
        },
        staleTime: Infinity,
        enabled: !!userId,
    });
};
//  Delete user by ID
export const useDeleteUser = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (userId) => {
            const { data } = await axiosInstance.delete(`/auth/deleteUser/${userId}`);
            return data;
        },
        onSuccess,
        onError,
    });
};
//  Update user by ID
export const useUpdateUser = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ userId, data }) => {
            const response = await axiosInstance.put(`/auth/updateUser/${userId}`, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};



// create Category
export const useCreateCategory = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/category/create', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// get list of Category
export const useCategory = (page = 1, limit = 2, searchKey = '') => {
    return useQuery({
        queryKey: ['categories', page, limit, searchKey],
        queryFn: async () => {
            const response = await axiosInstance.get('/category', {
                params: { page, limit, searchKey }
            });
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}
// get Category by Id
export const useGetCategory = (categoryId) => {
    return useQuery({
        queryKey: ['category', categoryId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/category/${categoryId}`)
            return response.data
        },
        staleTime: Infinity,
        enabled: !!categoryId,
    })
}
// delete Category
export const useDeleteCategory = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (categoryId) => {
            const { data } = await axiosInstance.delete(`/category/delete/${categoryId}`);
            return data;
        },
        onSuccess,
        onError,
    });
}
// update Category
export const useUpdateCategory = (handlers) => {
    return useMutation({
        mutationFn: async ({ categoryId, data }) => {
            const response = await axiosInstance.put(`/category/update/${categoryId}`, data);
            return response.data;
        },
        ...handlers
    });
};




// get User Metrices
export const useGetUserMetrices = () => {
    return useQuery({
        queryKey: ['userMetrices'],
        queryFn: async () => {
            const response = await axiosInstance.get('/auth/getAnayltics')
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}


// login
export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials) => {
            const response = await axiosInstance.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            saveToken(data.accessToken.token);
            localStorage.setItem('user', JSON.stringify(data.user.user_id))
            localStorage.setItem('userName', JSON.stringify(data.user.first_name))
            localStorage.setItem('userEmail', JSON.stringify(data.user.email))
            localStorage.setItem('userProfilePic', JSON.stringify(data.user.profile_pic))
            navigate('/');
        },
        onError: (error) => {
            console.error('Login failed:', error.response?.data?.message || error.message);
        },
    });
};

// register
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (userData) => {
            const response = await axiosInstance.post('/auth/register', userData);
            return { ...response.data, email: userData.email };
        },
        onSuccess: (data) => {
            navigate('/verification', { state: { email: data.email } });
        },
        onError: (error) => {
            console.error('Registration failed:', error.response?.data?.message || error.message);
        },
    });
};

// verification
export const useVerification = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (userData) => {
            const response = await axiosInstance.post('/auth/verify-email', userData);
            return response.data;
        },
        onSuccess: (data) => {
            saveToken(data.accessToken.token);
            localStorage.setItem('user', JSON.stringify(data.user))
            navigate('/dashboard/admin');
        },
        onError: (error) => {
            console.error('Registration failed:', error.response?.data?.message || error.message);
        },
    });
};


// logout
export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        removeToken();
        localStorage.removeItem('user')
        toast.success('Log out successfull');
        navigate('/login');
    };

    return logout;
};


