/* eslint-disable react-hooks/exhaustive-deps */
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { saveToken, removeToken } from '../utils/auth';
import { useNavigate } from "react-router-dom";
import axiosInstance from './ApiClient';
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

// get profile details
export const useGetProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await axiosInstance.get(`/profile`);
            return response.data;
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};
// update profile details
export const useUpdateProfile = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ data }) => {
            const response = await axiosInstance.put(`/profile`, data);
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
export const useGetExerciseLogs = (exerciseId, start, end) => {
    return useQuery({
        queryKey: ['exercise', exerciseId, start, end],
        queryFn: async () => {
            const response = await axiosInstance.get(`/exercises/logs`,
                { params: { exerciseId: exerciseId, start, end } }
            );
            return response.data
        },
        staleTime: Infinity,
    })
}
// Update exercise log
export const useUpdateExerciseLog = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await axiosInstance.put(`/exercises/${id}`, data);
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
export const useGetExerciseProgress = (exerciseId, start, end) => {
    return useQuery({
        queryKey: ['ExerciseSummary', exerciseId, start, end],
        queryFn: async () => {
            const response = await axiosInstance.get(`/exercises/progress/`, {
                params: { exerciseId, start, end }
            })
            return response.data
        }
    })
}


// add weight
export const useCreateWeight = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/weight', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// Get weight logs
export const useGetWeightLogs = (startDate, endDate) => {
    return useQuery({
        queryKey: ['weight', startDate, endDate],
        queryFn: async () => {
            const response = await axiosInstance.get(`/weight`,
                { params: { startDate, endDate } }
            );
            return response.data
        },
        staleTime: Infinity,
    })
}
// get Weight Metrices
export const useGetWeightMetrices = () => {
    return useQuery({
        queryKey: ['weightMetrices'],
        queryFn: async () => {
            const response = await axiosInstance.get('/weight/summary')
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// delete weight
export const useDeleteWeight = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/weight/${id}`);
            return data;
        },
        onSuccess,
        onError,
    });
}


//  Update user goals
export const useUpdateDailyGoal = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.put(`/food/summary`, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// get food summary
export const useGetCalorieSummary = (date) => {
    return useQuery({
        queryKey: ['foodSummary', date],
        queryFn: async () => {
            const response = await axiosInstance.get('/food/summary', {
                params: { date }
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// Get Food List
export const useGetFoods = (search) => {
    return useQuery({
        queryKey: ['foodList', search],
        queryFn: async () => {
            const response = await axiosInstance.get(`/food`, { params: { search } })
            return response.data
        }
    })
}
// Update food
export const useUpdateFood = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ foodId, data }) => {
            const response = await axiosInstance.put(`/food/${foodId}`, data);
            return response.data;
        },
        onSuccess,
        onError
    });
};
// add food
export const useCreateFood = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/food', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// delete food
export const useDeleteFood = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/food/${id}`);
            return data;
        },
        onSuccess,
        onError,
    });
}


// get foodLog
export const useGetFoodLog = (date) => {
    return useQuery({
        queryKey: ['foodLogs', date],
        queryFn: async () => {
            const response = await axiosInstance.get('/foodLog', {
                params: { date }
            });

            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// Get Food Log by id
export const useGetFoodLogById = (id) => {
    return useQuery({
        queryKey: ['foodLog', id],
        queryFn: async (id) => {
            const response = await axiosInstance.get(`/foodLog/${id}`)
            return response.data
        }
    })
}
// add foodLog
export const useCreateFoodLog = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/foodLog', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// delete foodLog
export const useDeleteFoodLog = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/foodLog/${id}`);
            return data;
        },
        onSuccess,
        onError,
    });
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
// dashboard
export const useGetDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const response = await axiosInstance.get("/dashboard");
            return response.data;
        },
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
    });
};

// ai
export const useAiChat = () => {
    return useMutation({
        mutationFn: async (message) => {
            const { data } = await axiosInstance.post("/ai/chat", { message });
            return data;
        },
    });
};
// get insights 
export const useGetInsights = () => {
    return useQuery({
        queryKey: ["insights"],
        queryFn: async () => {
            const response = await axiosInstance.get("/ai/insight");
            return response.data;
        },
    });
};




// login
export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials) => {
            const response = await axiosInstance.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("User Logged In Successfully")
            saveToken(data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user.id))
            localStorage.setItem('userName', JSON.stringify(data.user.name))
            localStorage.setItem('userEmail', JSON.stringify(data.user.email))
            navigate('/home');
        },
        onError: (error) => {
            console.error('Login failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message)
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
            toast.success("Code has been sent to your email")
            navigate('/verification', { state: { email: data.email } });
        },
        onError: (error) => {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message)
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
        onSuccess: () => {
            toast.success("User Verified Successfully")
            navigate('/');
        },
        onError: (error) => {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message)

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