import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Home, Package, User, LogOut } from "lucide-react";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

const Header = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };
    return (
        <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Home className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Dashboard
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <Link
                                href="/products"
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <Package className="w-4 h-4" />
                                <span>Products</span>
                            </Link>
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block text-gray-300">
                            Welcome, <span className="text-white font-medium">{user?.fullName || 'User'}</span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {getInitials(user?.fullName || 'User')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">
                                            {user?.fullName || 'User'}
                                        </p>
                                        <p className="text-xs leading-none text-gray-400">
                                            {user?.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-800" />
                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800" asChild>
                                    <Link href="/profile" className='flex items-center gap-2'>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800" asChild>
                                    <Link href="/products" className='flex items-center gap-2'>
                                        <Package className="mr-2 h-4 w-4" />
                                        <span>Products</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-800" />
                                <DropdownMenuItem
                                    className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Header