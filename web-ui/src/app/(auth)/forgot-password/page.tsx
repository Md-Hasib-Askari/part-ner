'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/atoms/inputs';
import { Text, Link } from '@/components/atoms/typography';
import { Spinner } from '@/components/atoms/loading';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simulate API call to send reset email
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            setEmailSent(true);
        } catch (error) {
            setErrors({ submit: 'Failed to send reset email. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setIsLoading(true);

        try {
            // Simulate resending email
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset timer or show confirmation
            setErrors({});
        } catch (error) {
            setErrors({ submit: 'Failed to resend email. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription>
                            We've sent a password reset link to{' '}
                            <span className="font-medium">{formData.email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 text-center">
                            <Text size="sm" className="text-muted-foreground">
                                Didn't receive the email? Check your spam folder or request a new one.
                            </Text>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleResendEmail}
                                disabled={isLoading}
                            >
                                {isLoading && <Spinner size="sm" className="mr-2" />}
                                {isLoading ? 'Sending...' : 'Resend email'}
                            </Button>
                        </div>

                        {errors.submit && (
                            <Text size="sm" className="text-red-600 text-center">
                                {errors.submit}
                            </Text>
                        )}

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

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Forgot your password?</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            helper="We'll send a password reset link to this email"
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
                            <Mail className="mr-2 h-4 w-4" />
                            {isLoading && <Spinner size="sm" className="mr-2" />}
                            {isLoading ? 'Sending...' : 'Send reset link'}
                        </Button>
                    </form>

                    {/* Back to Sign In */}
                    <div className="text-center">
                        <Link href="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
                            <ArrowLeft className="mr-1 h-3 w-3" />
                            Back to sign in
                        </Link>
                    </div>

                    {/* Additional Help */}
                    <div className="space-y-2 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            Need help? Contact our{' '}
                            <Link href="/support" className="text-primary hover:underline">
                                support team
                            </Link>
                        </Text>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
