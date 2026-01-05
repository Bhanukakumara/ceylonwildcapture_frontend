import axios from 'axios';

// API Base URL - update this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const currentPath = window.location.pathname;

        // If 401 and we have a refresh token, try to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    authApi.logout();
                    if (currentPath !== '/login') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available, clear and redirect
                authApi.logout();
                if (currentPath !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        }

        // If 403 (Forbidden), redirect to login as well
        // This handles cases where the token might be expired and results in a forbidden access
        if (error.response?.status === 403) {
            authApi.logout();
            if (currentPath !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// Types
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: 'BUYER' | 'PHOTOGRAPHER';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER';
    isActive: boolean;
    emailVerified: boolean;
    profileImageUrl?: string;
    createdAt: string;
    lastLogin?: string;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: { [key: string]: string };
}

// Auth API
export const authApi = {
    /**
     * User login
     */
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', credentials);

        // Store tokens and user data
        const { accessToken, refreshToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    /**
     * User registration
     */
    register: async (userData: RegisterRequest): Promise<void> => {
        await apiClient.post('/v1/users', {
            ...userData,
            isActive: true,
            emailVerified: false,
        });
    },

    /**
     * Verify email with token
     */
    verifyEmail: async (token: string): Promise<void> => {
        await apiClient.get(`/auth/verify-email?token=${token}`);
    },

    /**
     * Resend verification email
     */
    resendVerificationEmail: async (email: string): Promise<void> => {
        await apiClient.post(`/auth/resend-verification?email=${email}`);
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        sessionStorage.clear();
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('accessToken');
    },

    /**
     * Validate credentials
     */
    validateCredentials: async (credentials: LoginRequest): Promise<{ valid: boolean }> => {
        const response = await apiClient.post('/auth/validate', credentials);
        return response.data;
    },
};

// User API
export const userApi = {
    /**
     * Get user by ID
     */
    getUserById: async (userId: number): Promise<User> => {
        const response = await apiClient.get(`/v1/users/${userId}`);
        return response.data;
    },

    /**
     * Get user by email
     */
    getUserByEmail: async (email: string): Promise<User> => {
        const response = await apiClient.get(`/v1/users/email/${email}`);
        return response.data;
    },

    /**
     * Get user by username
     */
    getUserByUsername: async (username: string): Promise<User> => {
        const response = await apiClient.get(`/v1/users/username/${username}`);
        return response.data;
    },

    /**
     * Update user profile
     */
    updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
        const response = await apiClient.put(`/v1/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (userId: number, oldPassword: string, newPassword: string): Promise<void> => {
        await apiClient.put(`/v1/users/${userId}/password`, {
            oldPassword,
            newPassword,
        });
    },

    /**
     * Request password reset
     */
    requestPasswordReset: async (email: string): Promise<void> => {
        await apiClient.post('/v1/users/password-reset/request', { email });
    },

    /**
     * Reset password with token
     */
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        await apiClient.post('/v1/users/password-reset/reset', {
            token,
            newPassword,
        });
    },
};

// Admin User API
export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    photographers: number;
    buyers: number;
    admins: number;
    suspended: number;
    unverified: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface UserCreateRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER';
    isActive?: boolean;
    emailVerified?: boolean;
}

export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER';
    isActive?: boolean;
    emailVerified?: boolean;
}

export const adminUserApi = {
    /**
     * Get all users with pagination and filters
     */
    getAllUsers: async (
        page: number = 0,
        size: number = 10,
        role?: 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER',
        isActive?: boolean
    ): Promise<PageResponse<User>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (role) params.append('role', role);
        if (isActive !== undefined) params.append('isActive', isActive.toString());

        const response = await apiClient.get(`/v1/admin/users?${params.toString()}`);
        return response.data;
    },

    /**
     * Get user statistics
     */
    getUserStats: async (): Promise<UserStats> => {
        // Since the backend doesn't have a specific stats endpoint,
        // we'll fetch all users and calculate stats on the frontend
        const allUsers = await apiClient.get('/v1/admin/users?page=0&size=10000');
        const users: User[] = allUsers.data.content;

        return {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            photographers: users.filter(u => u.role === 'PHOTOGRAPHER').length,
            buyers: users.filter(u => u.role === 'BUYER').length,
            admins: users.filter(u => u.role === 'ADMIN').length,
            suspended: users.filter(u => !u.isActive).length,
            unverified: users.filter(u => !u.emailVerified).length,
        };
    },

    /**
     * Get user by ID
     */
    getUserById: async (userId: number): Promise<User> => {
        const response = await apiClient.get(`/v1/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Create new user
     */
    createUser: async (userData: UserCreateRequest): Promise<User> => {
        const response = await apiClient.post('/v1/users', userData);
        return response.data;
    },

    /**
     * Update user
     */
    updateUser: async (userId: number, userData: UserUpdateRequest): Promise<User> => {
        const response = await apiClient.put(`/v1/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Activate user (uses UserController endpoint - no auth required on that endpoint)
     */
    activateUser: async (userId: number): Promise<User> => {
        const response = await apiClient.put(`/v1/users/${userId}/activate`);
        return response.data;
    },

    /**
     * Deactivate user (uses UserController endpoint - no auth required on that endpoint)
     */
    deactivateUser: async (userId: number): Promise<User> => {
        const response = await apiClient.put(`/v1/users/${userId}/deactivate`);
        return response.data;
    },

    /**
     * Verify user email
     */
    verifyEmail: async (userId: number): Promise<User> => {
        const response = await apiClient.put(`/v1/users/${userId}/verify-email`);
        return response.data;
    },

    /**
     * Verify photographer
     */
    verifyPhotographer: async (userId: number): Promise<User> => {
        const response = await apiClient.post(`/v1/admin/users/${userId}/verify-photographer`);
        return response.data;
    },

    /**
     * Change user role
     */
    changeUserRole: async (userId: number, newRole: 'ADMIN' | 'PHOTOGRAPHER' | 'BUYER'): Promise<User> => {
        const response = await apiClient.put(`/v1/admin/users/${userId}/role?newRole=${newRole}`);
        return response.data;
    },

    /**
     * Ban user
     */
    banUser: async (userId: number, reason: string): Promise<User> => {
        const response = await apiClient.post(`/v1/admin/users/${userId}/ban?reason=${encodeURIComponent(reason)}`);
        return response.data;
    },

    /**
     * Unban user
     */
    unbanUser: async (userId: number): Promise<User> => {
        const response = await apiClient.post(`/v1/admin/users/${userId}/unban`);
        return response.data;
    },

    /**
     * Get banned users
     */
    getBannedUsers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
        const response = await apiClient.get(`/v1/admin/users/banned?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get verified photographers
     */
    getVerifiedPhotographers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
        const response = await apiClient.get(`/v1/admin/users/verified-photographers?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get unverified photographers
     */
    getUnverifiedPhotographers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
        const response = await apiClient.get(`/v1/admin/users/unverified-photographers?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get inactive users
     */
    getInactiveUsers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
        const response = await apiClient.get(`/v1/admin/users/inactive?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Delete user (soft delete)
     */
    deleteUser: async (userId: number): Promise<void> => {
        await apiClient.delete(`/v1/users/${userId}`);
    },

    /**
     * Search users
     */
    searchUsers: async (searchTerm: string, page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
        const response = await apiClient.get(`/v1/users/search?term=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
        return response.data;
    },
};

// Error handler helper
export const handleApiError = (error: any): ApiError => {
    if (error.response) {
        // Server responded with error
        return {
            message: error.response.data.message || 'An error occurred',
            status: error.response.status,
            errors: error.response.data.errors,
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'No response from server. Please check your connection.',
            status: 0,
        };
    } else {
        // Something else happened
        return {
            message: error.message || 'An unexpected error occurred',
            status: 0,
        };
    }
};

// ============================================================================
// Authentication Services
// ============================================================================

/**
 * Logout service - clears all authentication data
 */
export const logout = () => {
    // Clear all authentication tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');

    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');

    // Clear any session storage
    sessionStorage.clear();

    console.log('User logged out successfully');
};

// Photo Module API
export { photoApi, categoryApi, tagApi, publicStatsApi, photographerStatsApi } from './photo-api';
export type {
    Photo,
    PhotoStats,
    Category,
    Tag,
    PageResponse as PhotoPageResponse,
    CategoryCreateDto,
    CategoryUpdateDto,
    CategoryWithCount,
    CategoryStats,
    PublicStats,
    TopPhotographer,
    PhotographerStats
} from './photo-api';

export default apiClient;
