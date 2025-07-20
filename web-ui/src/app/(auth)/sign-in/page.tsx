'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput, PasswordInput } from '@/components/atoms/inputs';
import { Text, Link } from '@/components/atoms/typography';
import { Spinner } from '@/components/atoms/loading';
import { useAppStore } from '@/store';
import { Github, Mail } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const { setUser, setAuthenticated } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful authentication
            setUser({
                id: '1',
                email: formData.email,
                name: formData.email.split('@')[0],
                createdAt: new Date(),
                updatedAt: new Date(),
                preferences: {
                    theme: 'system',
                    notifications: {
                        email: true,
                        push: true,
                        desktop: true,
                        soundEnabled: true,
                        quietHours: {
                            enabled: false,
                            start: '22:00',
                            end: '07:00'
                        }
                    },
                    language: 'en',
                    timezone: 'UTC',
                    dashboardLayout: {
                        widgets: ['tasks', 'emails', 'finance', 'notifications'],
                        layout: 'grid',
                        compactMode: false
                    }
                }
            });
            setAuthenticated(true);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            setErrors({ submit: 'Invalid email or password. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: 'github' | 'google') => {
        setIsLoading(true);

        try {
            // Simulate social auth
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful social authentication
            setUser({
                id: '1',
                email: `user@${provider}.com`,
                name: `${provider} User`,
                createdAt: new Date(),
                updatedAt: new Date(),
                preferences: {
                    theme: 'system',
                    notifications: {
                        email: true,
                        push: true,
                        desktop: true,
                        soundEnabled: true,
                        quietHours: {
                            enabled: false,
                            start: '22:00',
                            end: '07:00'
                        }
                    },
                    language: 'en',
                    timezone: 'UTC',
                    dashboardLayout: {
                        widgets: ['tasks', 'emails', 'finance', 'notifications'],
                        layout: 'grid',
                        compactMode: false
                    }
                }
            });
            setAuthenticated(true);
            router.push('/dashboard');
        } catch (error) {
            setErrors({ submit: `Failed to sign in with ${provider}. Please try again.` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Social Authentication */}
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSocialAuth('github')}
                            disabled={isLoading}
                        >
                            <Github className="mr-2 h-4 w-4" />
                            Continue with GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSocialAuth('google')}
                            disabled={isLoading}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Continue with Google
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormInput
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={errors.email}
                            disabled={isLoading}
                            required
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            error={errors.password}
                            disabled={isLoading}
                            required
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                    className="rounded border-gray-300"
                                    disabled={isLoading}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

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
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <Text size="sm" className="text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/sign-up" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </Text>
                </CardContent>
            </Card>
        </div>
    );
}
