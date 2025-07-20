'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/atoms/inputs';
import { Text, Link } from '@/components/atoms/typography';
import { Spinner } from '@/components/atoms/loading';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [passwordReset, setPasswordReset] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const token = searchParams.get('token');

    useEffect(() => {
        // Validate token on mount
        const validateToken = async () => {
            if (!token) {
                setIsValidToken(false);
                return;
            }

            try {
                // Simulate token validation
                await new Promise(resolve => setTimeout(resolve, 1000));
                setIsValidToken(true);
            } catch (error) {
                setIsValidToken(false);
            }
        };

        validateToken();
    }, [token]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simulate API call to reset password
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            setPasswordReset(true);
        } catch (error) {
            setErrors({ submit: 'Failed to reset password. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Loading state while validating token
    if (isValidToken === null) {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Verifying reset link</CardTitle>
                        <CardDescription>
                            Please wait while we verify your password reset link
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-8">
                        <Spinner size="lg" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Invalid token state
    if (!isValidToken) {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Invalid reset link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            Password reset links expire after 1 hour for security reasons.
                        </Text>

                        <Button
                            className="w-full"
                            onClick={() => router.push('/forgot-password')}
                        >
                            Request new reset link
                        </Button>

                        <Link href="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
                            <ArrowLeft className="mr-1 h-3 w-3" />
                            Back to sign in
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Success state
    if (passwordReset) {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Password reset successful</CardTitle>
                        <CardDescription>
                            Your password has been successfully reset
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            You can now sign in with your new password.
                        </Text>

                        <Button
                            className="w-full"
                            onClick={() => router.push('/sign-in')}
                        >
                            Continue to sign in
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <PasswordInput
                                label="New Password"
                                placeholder="Enter your new password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                error={errors.password}
                                disabled={isLoading}
                                required
                            />

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 w-full rounded ${i < passwordStrength
                                                        ? passwordStrength <= 2
                                                            ? 'bg-red-500'
                                                            : passwordStrength <= 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        : 'bg-muted'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <Text size="xs" className="text-muted-foreground">
                                        Password strength: {
                                            passwordStrength <= 2 ? 'Weak' :
                                                passwordStrength <= 3 ? 'Medium' : 'Strong'
                                        }
                                    </Text>
                                </div>
                            )}
                        </div>

                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            disabled={isLoading}
                            required
                        />

                        {errors.submit && (
                            <Text size="sm" className="text-red-600 text-center">
                                {errors.submit}
                            </Text>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading && <Spinner size="sm" className="mr-2" />}
                            {isLoading ? 'Resetting password...' : 'Reset password'}
                        </Button>
                    </form>

                    {/* Back to Sign In */}
                    <div className="text-center">
                        <Link href="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
                            <ArrowLeft className="mr-1 h-3 w-3" />
                            Back to sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
