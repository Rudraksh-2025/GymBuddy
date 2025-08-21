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


// Get Exercise by muscle group
export const useGetExerciseByMuscle = (muscle) => {
    return useQuery({
        queryKey: ['muscleGroup', muscle],
        queryFn: async () => {
            const response = await axiosInstance.get(`/exercises/group/${muscle}`)
            return response.data
        }
    })
}
// Get Exercise List
export const useGetExercise = (muscle) => {
    return useQuery({
        queryKey: ['exerciseList', muscle],
        queryFn: async () => {
            const response = await axiosInstance.get(`/exercises/exercise/${muscle}`)
            return response.data
        }
    })
}
// create  exercise
export const useCreateExercise = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/exercises/exercise', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// delete  exercise
export const useDeleteExercise = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (exerciseId) => {
            const response = await axiosInstance.delete(`/exercises/exercise/${exerciseId}`)
            return response.data
        },
        onSuccess,
        onError
    })
}
// create  exercise log
export const useCreateExerciselog = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/exercises', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// Get exercise logs
export const useGetExerciseLogs = () => {
    return useQuery({
        queryKey: ['exercise'],
        queryFn: async () => {
            const response = await axiosInstance.get(`/exercises`);
            return response.data
        },
        staleTime: Infinity,
    })
}
// Update exercise log
export const useUpdateExerciseLog = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ exerciseID, data }) => {
            const response = await axiosInstance.put(`/exercises/${exerciseID}`, data);
            return response.data;
        },
        onSuccess,
        onError
    });
};
// Delete exercise log
export const useDeleteExerciseLog = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (exerciseID) => {
            const { data } = await axiosInstance.delete(`/exercises/${exerciseID}`);
            return data;
        },
        onSuccess,
        onError,
    });
}
// get exercise progress 
export const useGetExerciseProgress = (exerciseName, start, end) => {
    return useQuery({
        queryKey: ['muscleGroup', exerciseName, start, end],
        queryFn: async () => {
            const response = await axiosInstance.get(`/exercises/progress/`, {
                params: { exerciseName, start, end }
            })
            return response.data
        }
    })
}









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
            saveToken(data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user.id))
            localStorage.setItem('userName', JSON.stringify(data.user.name))
            localStorage.setItem('userEmail', JSON.stringify(data.user.email))
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
            saveToken(data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user.id))
            localStorage.setItem('userName', JSON.stringify(data.user.name))
            localStorage.setItem('userEmail', JSON.stringify(data.user.email))
            navigate('/');
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


