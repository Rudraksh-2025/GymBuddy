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
// update user status
export const useUpdateStatus = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ userId, params }) => {
            const response = await axiosInstance.put(`/auth/updateStatus/${userId}`, null, {
                params
            });
            return response.data;
        },
        onSuccess,
        onError,
    });
};


// get list of universities
export const useUniversities = () => {
    return useQuery({
        queryKey: ['universities'],
        queryFn: async () => {
            const response = await axiosInstance.get('/university');
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}
// get University by Id
export const useGetUni = (uniId) => {
    return useQuery({
        queryKey: ['univeristy', uniId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/university/${uniId}`)
            return response.data
        },
        staleTime: Infinity,
        enabled: !!uniId,
    })
}
// update university
export const useUpdateUni = (handlers) => {
    return useMutation({
        mutationFn: async ({ uniId, data }) => {
            const response = await axiosInstance.put(`/university/update/${uniId}`, data);
            return response.data;
        },
        ...handlers
    });
};
// update status university
export const useUpdateUniStatus = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ uniId, params }) => {
            const response = await axiosInstance.put(`/university/statusUpdate/${uniId}`, null, {
                params
            });
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// create university
export const useCreateUni = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/university/create', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// delete university
export const useDelUni = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (uniId) => {
            const { data } = await axiosInstance.delete(`/university/delete/${uniId}`);
            return data;
        },
        onSuccess,
        onError,
    });
}


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
// update status category
export const useUpdateCategoryStatus = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ categoryId, params }) => {
            const response = await axiosInstance.put(`/category/statusUpdate/${categoryId}`, null, {
                params
            });
            return response.data;
        },
        onSuccess,
        onError,
    });
};

// get all orders list
export const useGetOrders = (page = 1, limit = 2, status, type) => {
    return useQuery({
        queryKey: ['orderListing', page, limit, status, type],
        queryFn: async () => {
            const response = await axiosInstance.get('/order/getOrderByStatus/', {
                params: { page, limit, status, type }
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

// get All Sublease
export const useSublease = (page = 1, limit = 2, searchKey = '', status = 'all', userId = '') => {
    return useQuery({
        queryKey: ['subleases', page, limit, searchKey, status, userId],
        queryFn: async () => {
            const cleanedStatus = status === 'all' ? '' : status;
            const response = await axiosInstance.post('/sublease', {
                page,
                limit,
                searchKey,
                status: cleanedStatus,
                userId
            });
            return response.data;
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
        enabled: !!status || !!searchKey || !!userId,
    });
};
//  Get sublease by ID
export const useSubleaseById = (subleaseId) => {
    return useQuery({
        queryKey: ['sublease', subleaseId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/sublease/${subleaseId}`);
            return data;
        },
        staleTime: Infinity,
        enabled: !!subleaseId,
    });
};
//  Delete sublease by ID
export const useDeleteSublease = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (subleaseId) => {
            const { data } = await axiosInstance.delete(`/sublease/delete/${subleaseId}`);
            return data;
        },
        onSuccess,
        onError,
    });
};
//  Update Sublease by ID
export const useUpdateSublease = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ subleaseId, data }) => {
            const response = await axiosInstance.put(`/sublease/update/${subleaseId}`, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// update status or isBoostList by id sublease
export const useUpdateSubleaseStatus = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ subleaseId, ...params }) => {
            const response = await axiosInstance.put(`/sublease/statusUpdate/${subleaseId}`, null, {
                params
            });
            return response.data;
        },
        onSuccess,
        onError,
    });
};


// get All marketplace
export const useMarketPlace = (page = 1, limit = 2, searchKey = '', status = 'all', userId = '') => {
    return useQuery({
        queryKey: ['marketplaces', page, limit, searchKey, status, userId],
        queryFn: async () => {
            const cleanedStatus = status === 'all' ? '' : status;
            const response = await axiosInstance.post('/marketplace/',
                { page, limit, searchKey, status: cleanedStatus, userId },
            );
            return response.data;
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
        enabled: true,
    });
};
//  get By Id marketplace
export const useMarketPlaceById = (productId) => {
    return useQuery({
        queryKey: ['marketplace', productId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/marketplace/${productId}`);
            return data;
        },
        staleTime: Infinity,
        enabled: !!productId,
    });
};
//  Delete marketplace by ID
export const useDeleteMarketPlace = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (productId) => {
            const { data } = await axiosInstance.delete(`/marketplace/delete/${productId}`);
            return data;
        },
        onSuccess,
        onError,
    });
};
//update status or isBoostList by id marketplace
export const useMarketPlaceStatus = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ productId, ...params }) => {
            const response = await axiosInstance.put(`/marketplace/statusUpdate/${productId}`, null, {
                params
            });
            return response.data;
        },
        onSuccess,
        onError,
    });
};


// create ads
export const useCreateAds = (options = {}) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/ads/create', data);
            return response.data;
        },
        ...options,
    });
};
// get all ads
export const useGetAllAds = (page = 1, limit = 6) => {
    return useQuery({
        queryKey: ['ads', page],
        queryFn: async () => {
            const response = await axiosInstance.get('/ads', {
                params: { page, limit },
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// delete ads by Id
export const useDelAds = (options = {}) => {
    return useMutation(
        {
            mutationFn: async (adId) => {
                const response = await axiosInstance.delete(`/ads/delete/${adId}`)
                return response.data
            },
            ...options,
        }
    )
}
// update ads
export const useUpdateAds = (options = {}) => {
    return useMutation({
        mutationFn: async ({ adId, data }) => {
            const response = await axiosInstance.put(`/ads/update/${adId}`, data)
            return response.data
        },
        ...options,
    })
}


//create notification 
export const useCreateNotification = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/notification/create', data)
            return response.data
        },
        onSuccess,
        onError
    })
}
// get all notification
export const useGetNotification = (page = 1, limit = 6) => {
    return useQuery({
        queryKey: ['notifications', page],
        queryFn: async () => {
            const response = await axiosInstance.get('/notification', {
                params: { page, limit },
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// delete notification
export const useDelNotification = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`/notification/${id}`)
            return response.data
        },
        onSuccess,
        onError
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

// get all boosted list
export const useGetBoostedList = (page = 1, limit = 2) => {
    return useQuery({
        queryKey: ['boostedList', page, limit],
        queryFn: async () => {
            const response = await axiosInstance.get('/marketplace/bootList/data', {
                params: { page, limit }
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

// get all Report logs
export const useGetReports = (page = 1, limit = 2, filter = '') => {
    return useQuery({
        queryKey: ['reports', page, limit, filter],
        queryFn: async () => {
            const response = await axiosInstance.get('/report/', {
                params: { page, limit, filter }
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// handle report status change
export const useReportStatus = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ reportId, body }) => {
            const response = await axiosInstance.put(`report/update/${reportId}`, body);
            return response.data;
        },
        onSuccess,
        onError,
    });
};

// get all Transactions list
export const useGetTransaction = (page = 1, limit = 2, status = '', orderby = 'desc') => {
    return useQuery({
        queryKey: ['transaction', page, limit, status, orderby],
        queryFn: async () => {
            const cleanedStatus = status === 'all' ? '' : status;
            const response = await axiosInstance.get('/payment/getAllTransction', {
                params: { page, limit, status: cleanedStatus, orderby }
            })
            return response.data
        },
        staleTime: 15 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
// get User Transaction History
export const useUserTransaction = (limit = 2, userId) => {
    return useQuery(
        {
            queryKey: ['transactions', limit, userId],
            queryFn: async () => {
                const response = await axiosInstance.get('/payment/customerTransaction', {
                    params: { limit, userId }
                })
                return response.data
            },
            staleTime: 15 * 60 * 1000,
            placeholderData: keepPreviousData,
        }
    )
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
// export const useRegister = () => {
//     const navigate = useNavigate();

//     return useMutation({
//         mutationFn: async (userData) => {
//             const response = await axiosInstance.post('/auth/register', userData);
//             return { ...response.data, email: userData.email };
//         },
//         onSuccess: (data) => {
//             navigate('/verification', { state: { email: data.email } });
//         },
//         onError: (error) => {
//             console.error('Registration failed:', error.response?.data?.message || error.message);
//         },
//     });
// };

// verification
// export const useVerification = () => {
//     const navigate = useNavigate();

//     return useMutation({
//         mutationFn: async (userData) => {
//             const response = await axiosInstance.post('/auth/verification', userData);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             saveToken(data.accessToken.token);
//             localStorage.setItem('user', JSON.stringify(data.user))
//             navigate('/dashboard/admin');
//         },
//         onError: (error) => {
//             console.error('Registration failed:', error.response?.data?.message || error.message);
//         },
//     });
// };


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


