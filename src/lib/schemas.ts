import { z } from "zod";

export const signInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email("Please enter a valid email address"),
    mobileNo: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>; 