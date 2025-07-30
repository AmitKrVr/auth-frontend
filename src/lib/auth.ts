import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://auth-backend-4ojx.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
            window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

export interface User {
    id: number;
    fullName: string;
    email: string;
    mobileNo: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData {
    fullName: string;
    email: string;
    mobileNo: string;
    password: string;
}

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
    }
};

export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

export const setUser = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const removeUser = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
        const response = await api.post('/api/v1/auth/login', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Login failed');
    }
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
    try {
        const response = await api.post('/api/v1/auth/signup', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Signup failed');
    }
};

export const logout = (): void => {
    removeToken();
    removeUser();
};

export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

export { api }; 