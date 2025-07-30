'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, login as loginApi, signup as signupApi, logout as logoutApi, getUser, setUser, setToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (fullName: string, email: string, mobileNo: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const currentUser = getUser();
        if (currentUser) {
            setUserState(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await loginApi({ email, password });
            setToken(response.token);
            setUser(response.user);
            setUserState(response.user);
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const signup = async (fullName: string, email: string, mobileNo: string, password: string) => {
        try {
            const response = await signupApi({ fullName, email, mobileNo, password });
            setToken(response.token);
            setUser(response.user);
            setUserState(response.user);
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        logoutApi();
        setUserState(null);
        router.push('/sign-in');
    };

    const updateUser = (userData: User) => {
        setUserState(userData);
        setUser(userData);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 