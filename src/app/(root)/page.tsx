'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    Package,
    ArrowRight,
    Mail,
    Phone,
    TrendingUp,
} from 'lucide-react';

export default function HomePage() {
    const { user } = useAuth();

    const quickActions = [
        {
            title: 'Manage Products',
            description: 'View, add, and edit your product catalog',
            href: '/products',
            icon: Package,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'User Profile',
            description: 'Update your personal information and settings',
            href: '/profile',
            icon: User,
            color: 'from-purple-500 to-pink-500'
        },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Welcome Back, {user?.fullName || 'User'}!
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Your dashboard is ready. Manage your products, update your profile, and explore all the features available to you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center space-x-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <span>Profile Information</span>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Your account details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-300">Full Name</p>
                                        <p className="text-white">{user?.fullName || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-300">Email Address</p>
                                        <p className="text-white text-sm">{user?.email || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-300">Mobile Number</p>
                                        <p className="text-white">{user?.mobileNo || 'Not provided'}</p>
                                    </div>
                                </div>

                                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Link href="/profile">
                                        Edit Profile
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <span>Quick Actions</span>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Get started with the most common tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {quickActions.map((action, index) => (
                                        <Link key={index} href={action.href}>
                                            <div className="group p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:bg-gray-800/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                                            <action.icon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                                {action.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-400">
                                                                {action.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}