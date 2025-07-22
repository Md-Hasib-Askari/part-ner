"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/atoms/typography';
import { LoadingOverlay, Spinner } from '@/components/atoms/loading';
import {
    User,
    Shield,
    Eye,
    EyeOff,
    Chrome,
    Github,
    Mail,
    ArrowLeft,
    Settings
} from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    showBackButton?: boolean;
    showThemeToggle?: boolean;
    isLoading?: boolean;
    variant?: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email';
}

export function AuthLayout({
    children,
    className,
    title,
    description,
    showBackButton = false,
    showThemeToggle = true,
    isLoading = false,
    variant = 'signin'
}: AuthLayoutProps) {
    const { theme, toggleTheme } = useTheme();

    const getDefaultTitle = () => {
        switch (variant) {
            case 'signin':
                return 'Welcome Back';
            case 'signup':
                return 'Create Account';
            case 'forgot-password':
                return 'Reset Password';
            case 'reset-password':
                return 'Set New Password';
            case 'verify-email':
                return 'Verify Email';
            default:
                return 'Authentication';
        }
    };

    const getDefaultDescription = () => {
        switch (variant) {
            case 'signin':
                return 'Sign in to your AI assistant account';
            case 'signup':
                return 'Create your AI assistant account';
            case 'forgot-password':
                return 'Enter your email to reset your password';
            case 'reset-password':
                return 'Enter your new password';
            case 'verify-email':
                return 'Check your email for verification link';
            default:
                return 'Please authenticate to continue';
        }
    };

    return (
        <div className={cn(
            "min-h-screen flex flex-col lg:flex-row bg-background transition-colors duration-300 relative",
            theme === 'dark' ? 'dark' : '',
            className
        )}>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80"
                    style={{ backdropFilter: 'blur(4px)' }}>
                    <div className="flex flex-col items-center space-y-2">
                        <Spinner size="lg" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )}

            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:flex-col lg:justify-center lg:w-1/2 xl:w-2/5 bg-primary text-primary-foreground p-8 lg:p-12">
                <div className="max-w-md mx-auto space-y-8">
                    {/* Logo/Brand */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-background/10 rounded-xl mb-6">
                            <User className="h-8 w-8" />
                        </div>
                        <h1 className="text-3xl font-bold">AI Assistant</h1>
                        <p className="text-primary-foreground/80 mt-2">
                            Your intelligent personal productivity companion
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Secure & Private</h3>
                                <p className="text-sm text-primary-foreground/80">
                                    Your data is encrypted and stored securely with enterprise-grade protection.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <Settings className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">AI-Powered</h3>
                                <p className="text-sm text-primary-foreground/80">
                                    Advanced AI helps manage tasks, emails, and provides intelligent insights.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <Mail className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Multi-Platform</h3>
                                <p className="text-sm text-primary-foreground/80">
                                    Access your assistant from any device, anywhere, anytime.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-background/5 rounded-lg p-6">
                        <blockquote className="text-sm italic mb-3">
                            "This AI assistant has transformed my productivity. I can't imagine working without it."
                        </blockquote>
                        <footer className="text-xs text-primary-foreground/80">
                            — Sarah Chen, Product Manager
                        </footer>
                    </div>
                </div>
            </div>

            {/* Right Side - Authentication Form */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
                <div className="w-full max-w-md mx-auto space-y-6">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between">
                        {showBackButton && (
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        )}

                        <div className="flex-1" />

                        {showThemeToggle && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-9 w-9"
                            >
                                {theme === 'dark' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">AI Assistant</h1>
                    </div>

                    {/* Auth Card */}
                    {children}

                    {/* Terms & Privacy */}
                    <div className="text-center">
                        <Text size="xs" className="text-muted-foreground">
                            By continuing, you agree to our{' '}
                            <a href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </a>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Layout variants for specific auth flows
export function SignInLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <AuthLayout variant="signin" className={className}>
            {children}
        </AuthLayout>
    );
}

export function SignUpLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <AuthLayout variant="signup" className={className}>
            {children}
        </AuthLayout>
    );
}

export function ForgotPasswordLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <AuthLayout
            variant="forgot-password"
            showBackButton={true}
            className={className}
        >
            {children}
        </AuthLayout>
    );
}

export function ResetPasswordLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <AuthLayout
            variant="reset-password"
            showBackButton={true}
            className={className}
        >
            {children}
        </AuthLayout>
    );
}

export function VerifyEmailLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <AuthLayout variant="verify-email" className={className}>
            {children}
        </AuthLayout>
    );
}

export default AuthLayout;
