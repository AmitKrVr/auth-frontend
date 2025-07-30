'use client';

import Image from "next/image";
import React from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <main className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-[url('/images/bg.svg')] bg-cover bg-center bg-no-repeat text-[var(--foreground)] before:absolute before:inset-0 before:bg-black/60 before:z-0">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>

            </main>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-[url('/images/bg.svg')] bg-cover bg-center bg-no-repeat text-[var(--foreground)] before:absolute before:inset-0 before:bg-black/60 before:z-0">
            <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl h-auto md:h-[600px] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md bg-[var(--card)]/30 border border-[var(--border)]/50">

                <section className="flex-1 p-6 sm:p-8 md:p-12 flex flex-col hide-scrollbar overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Image src="/next.svg" alt="BookWise Logo" width={45} height={45} />
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
                            Authentication
                        </h1>
                    </div>
                    <div>{children}</div>
                </section>

                <section className="flex-1 relative hidden md:block">
                    <Image
                        src="/images/auth-illustration.png"
                        alt="Auth Illustration"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                        <p className="text-white text-xl font-medium">
                            Your gateway to a world of knowledge.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}