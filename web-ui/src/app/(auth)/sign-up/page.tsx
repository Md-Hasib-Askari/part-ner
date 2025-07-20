'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput, PasswordInput } from '@/components/atoms/inputs';
import { Text, Link } from '@/components/atoms/typography';
import { Spinner } from '@/components/atoms/loading';
import { useAppStore } from '@/store';
import { Github, Mail, Check } from 'lucide-react';

export default function SignUpPage() {
    const router = useRouter();
    const { setUser, setAuthenticated } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

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

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock successful registration
            setUser({
                id: '1',
                email: formData.email,
                name: formData.name,
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

            // Redirect to verify email page
            router.push('/verify-email');
        } catch (error) {
            setErrors({ submit: 'Failed to create account. Please try again.' });
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
            setErrors({ submit: `Failed to sign up with ${provider}. Please try again.` });
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

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Get started with your AI personal assistant
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

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormInput
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            error={errors.name}
                            disabled={isLoading}
                            required
                        />

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

                        <div className="space-y-2">
                            <PasswordInput
                                label="Password"
                                placeholder="Create a secure password"
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
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            disabled={isLoading}
                            required
                        />

                        <div className="space-y-2">
                            <label className="flex items-start space-x-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                    className="rounded border-gray-300 mt-1"
                                    disabled={isLoading}
                                />
                                <span className="leading-5">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-primary hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <Text size="sm" className="text-red-600">
                                    {errors.agreeToTerms}
                                </Text>
                            )}
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
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <Text size="sm" className="text-center text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </Text>
                </CardContent>
            </Card>
        </div>
    );
}
