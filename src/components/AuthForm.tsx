"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form"
import { ZodType } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { FIELD_NAMES, FIELD_TYPES } from "@/constant";

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean, error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
    type, schema, defaultValues, onSubmit
}: Props<T>) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isSignIn = type === "SIGN_IN"

    const form = useForm<T>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema as any),
        defaultValues: defaultValues as DefaultValues<T>
    })

    const handleSubmit: SubmitHandler<T> = async (data) => {
        setLoading(true)

        try {
            const result = await onSubmit(data);
            if (result.success) {
                toast.success("Success", {
                    description: `You have successfully ${isSignIn ? "signed in" : "signed up"}.`
                })
                router.push("/");
            } else {
                toast.error(`Error ${isSignIn ? "signing in" : "signing up"}`, {
                    description: result.error ?? `An error occurred during ${isSignIn ? "signing in" : "signing up"}`
                })
            }
        } catch (err) {
            console.error("AuthForm onSubmit error:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false)
        }
    }

    const getFieldIcon = (fieldName: string) => {
        switch (fieldName) {
            case 'email':
                return <Mail className="h-4 w-4 text-slate-500" />
            case 'password':
                return <Lock className="h-4 w-4 text-slate-500" />
            case 'fullName':
                return <User className="h-4 w-4 text-slate-500" />
            case 'mobileNo':
                return <Phone className="h-4 w-4 text-slate-500" />
            default:
                return null
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-md w-full">
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold text-foreground">
                    {isSignIn ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {isSignIn
                        ? "Sign in to explore and manage your product lists seamlessly."
                        : "Fill in your details to create an account and start organizing your favorite products."}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    {Object.keys(defaultValues).map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as Path<T>}
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium text-foreground">
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                                {getFieldIcon(field.name)}
                                            </div>
                                            <Input
                                                required
                                                type={field.name === 'password' && !showPassword ? 'password' :
                                                    field.name === 'password' && showPassword ? 'text' :
                                                        FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                {...field}
                                                className="h-12 pl-10 pr-12 bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-ring transition-all duration-200"
                                                placeholder={`Enter your ${FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]?.toLowerCase()}`}
                                            />
                                            {field.name === 'password' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-destructive text-xs" />
                                </FormItem>
                            )}
                        />
                    ))}

                    {/* {isSignIn && (
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )} */}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isSignIn ? "Signing in..." : "Creating account..."}
                            </>
                        ) : (
                            isSignIn ? "Sign In" : "Create Account"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="text-center">
                <p className="text-muted-foreground text-sm">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                    {" "}
                    <Link
                        href={isSignIn ? "/sign-up" : "/sign-in"}
                        className="text-foreground hover:text-foreground/80 font-medium transition-colors underline underline-offset-2"
                    >
                        {isSignIn ? "Create one now" : "Sign in instead"}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm; 