"use client"

import AuthForm from "@/components/AuthForm";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
    const { signup } = useAuth();

    const handleSignUp = async (data: SignUpFormData) => {
        try {
            await signup(data.fullName, data.email, data.mobileNo, data.password);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to sign up"
            };
        }
    };

    return (
        <AuthForm
            type="SIGN_UP"
            schema={signUpSchema}
            defaultValues={{
                fullName: "",
                email: "",
                mobileNo: "",
                password: ""
            }}
            onSubmit={handleSignUp}
        />
    );
}