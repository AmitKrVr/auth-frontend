'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { updateUserProfile, changePassword } from '@/lib/userService';
import {
    User,
    Mail,
    Phone,
    Lock,
    Shield,
    Edit3,
    Eye,
    KeyRound,
    CheckCircle,
    Loader2
} from 'lucide-react';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'password'>('view');
    const [loading, setLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        mobileNo: user?.mobileNo || ''
    });

    useEffect(() => {
        setEditForm({
            fullName: user?.fullName || '',
            email: user?.email || '',
            mobileNo: user?.mobileNo || ''
        });
    }, [user]);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedUser = await updateUserProfile(editForm);
            updateUser(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await changePassword(passwordForm);
            toast.success('Password changed successfully!');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const tabs = [
        { id: 'view', label: 'View Profile', icon: Eye },
        { id: 'edit', label: 'Edit Profile', icon: Edit3 },
        { id: 'password', label: 'Change Password', icon: KeyRound }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">User Profile</h1>
                                <p className="text-blue-100 mt-2">Manage your account settings and preferences</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-800">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'view' | 'edit' | 'password')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <CardContent className="p-6">
                        {activeTab === 'view' && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-gray-800/30 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center space-x-2">
                                                <User className="w-5 h-5 text-blue-400" />
                                                <span>Personal Information</span>
                                            </CardTitle>
                                            <CardDescription className="text-gray-400">
                                                Your basic profile details
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-300">Full Name</Label>
                                                    <p className="text-white">{user?.fullName || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-300">Email Address</Label>
                                                    <p className="text-white text-sm">{user?.email || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-300">Mobile Number</Label>
                                                    <p className="text-white">{user?.mobileNo || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center space-x-2">
                                                <Shield className="w-5 h-5 text-green-400" />
                                                <span>Account Information</span>
                                            </CardTitle>
                                            <CardDescription className="text-gray-400">
                                                Account status and security details
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-300">User ID</Label>
                                                    <p className="text-white font-mono text-sm">{user?.id || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-300">Account Status</Label>
                                                    <div className="mt-1">
                                                        <Badge className="bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/40">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30">
                                                <Lock className="w-4 h-4 text-blue-400" />
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-300">Security</Label>
                                                    <div className="mt-1">
                                                        <Badge className="bg-blue-900/30 text-blue-400 border-blue-800 hover:bg-blue-900/40">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            Protected
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeTab === 'edit' && (
                            <div className="max-w-2xl">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                        <Edit3 className="w-5 h-5 text-blue-400" />
                                        <span>Edit Profile Information</span>
                                    </h3>
                                    <p className="text-gray-400 mt-1">Update your personal information</p>
                                </div>

                                <Card className="bg-gray-800/30 border-gray-700">
                                    <CardContent className="p-6">
                                        <form onSubmit={handleEditSubmit} className="space-y-6">
                                            <div className="space-y-6">
                                                <div>
                                                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                        <User className="w-4 h-4" />
                                                        <span>Full Name</span>
                                                    </Label>
                                                    <Input
                                                        id="fullName"
                                                        name="fullName"
                                                        type="text"
                                                        value={editForm.fullName}
                                                        onChange={handleEditChange}
                                                        className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                        <Mail className="w-4 h-4" />
                                                        <span>Email Address</span>
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={editForm.email}
                                                        onChange={handleEditChange}
                                                        className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="mobileNo" className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                        <Phone className="w-4 h-4" />
                                                        <span>Mobile Number</span>
                                                    </Label>
                                                    <Input
                                                        id="mobileNo"
                                                        name="mobileNo"
                                                        type="tel"
                                                        value={editForm.mobileNo}
                                                        onChange={handleEditChange}
                                                        className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                        placeholder="Enter your mobile number"
                                                    />
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        onClick={handleEditSubmit}
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Edit3 className="w-4 h-4 mr-2" />
                                                                Update Profile
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="max-w-2xl">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                        <KeyRound className="w-5 h-5 text-red-400" />
                                        <span>Change Password</span>
                                    </h3>
                                    <p className="text-gray-400 mt-1">Update your account password for better security</p>
                                </div>

                                <Card className="bg-gray-800/30 border-gray-700">
                                    <CardContent className="p-6">
                                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                            <div>
                                                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <Lock className="w-4 h-4" />
                                                    <span>Current Password</span>
                                                </Label>
                                                <Input
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type="password"
                                                    value={passwordForm.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                    placeholder="Enter your current password"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <KeyRound className="w-4 h-4" />
                                                    <span>New Password</span>
                                                </Label>
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                    placeholder="Enter your new password"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <Shield className="w-4 h-4" />
                                                    <span>Confirm New Password</span>
                                                </Label>
                                                <Input
                                                    id="confirmNewPassword"
                                                    name="confirmNewPassword"
                                                    type="password"
                                                    value={passwordForm.confirmNewPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                    placeholder="Confirm your new password"
                                                    required
                                                />
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Changing Password...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <KeyRound className="w-4 h-4 mr-2" />
                                                            Change Password
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}