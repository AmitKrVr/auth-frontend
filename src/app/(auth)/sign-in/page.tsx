"use client"

import AuthForm from "@/components/AuthForm";
import { signInSchema, type SignInFormData } from "@/lib/schemas";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
    const { login } = useAuth();

    const handleSignIn = async (data: SignInFormData) => {
        try {
            await login(data.email, data.password);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to sign in"
            };
        }
    };

    return (
        <AuthForm
            type="SIGN_IN"
            schema={signInSchema}
            defaultValues={{
                email: "",
                password: ""
            }}
            onSubmit={handleSignIn}
        />
    );
}