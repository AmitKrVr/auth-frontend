import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://auth-backend-4ojx.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface CookieOptions {
    expires?: number;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
}

const COOKIE_OPTIONS: CookieOptions = {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
};

const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.expires) {
        const date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
    }

    if (options.path) cookieString += `; path=${options.path}`;
    if (options.secure) cookieString += '; secure';
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

    document.cookie = cookieString;
};

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
};

const removeCookie = (name: string, options: CookieOptions = {}) => {
    if (typeof document === 'undefined') return;

    setCookie(name, '', { ...options, expires: -1 });
};

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
        // Only handle 401 errors for authenticated requests (requests with tokens)
        // Don't handle 401 for login/signup requests as they should show error messages
        if (error.response?.status === 401 && getToken()) {
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
    return getCookie('authToken');
};

export const setToken = (token: string): void => {
    setCookie('authToken', token, COOKIE_OPTIONS);
};

export const removeToken = (): void => {
    removeCookie('authToken', { path: '/' });
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