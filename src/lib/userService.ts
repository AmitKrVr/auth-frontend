import axios from 'axios';
import { api } from './auth';
import { User } from './auth';

export interface UpdateProfileData {
    fullName?: string;
    email?: string;
    mobileNo?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const getUserProfile = async (): Promise<User> => {
    try {
        const response = await api.get('/api/v1/user/profile');
        return response.data.user;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch user profile');
    }
};

export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
    try {
        const response = await api.patch('/api/v1/user/profile', data);
        return response.data.user;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to update profile');
    }
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
    try {
        await api.patch('/api/v1/user/password', data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to change password');
    }
}; 