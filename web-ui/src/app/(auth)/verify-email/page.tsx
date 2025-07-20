'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text, Link } from '@/components/atoms/typography';
import { Spinner } from '@/components/atoms/loading';
import { useAppStore } from '@/store';
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
    const [isResending, setIsResending] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email') || user?.email || '';

    useEffect(() => {
        // If there's a token, attempt verification
        if (token) {
            verifyEmail(token);
        }
    }, [token]);

    const verifyEmail = async (verificationToken: string) => {
        setIsLoading(true);

        try {
            // Simulate email verification API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate different outcomes based on token
            if (verificationToken === 'expired') {
                setVerificationStatus('expired');
            } else if (verificationToken === 'invalid') {
                setVerificationStatus('error');
            } else {
                setVerificationStatus('success');

                // Auto-redirect to dashboard after successful verification
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            }
        } catch (error) {
            setVerificationStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            return;
        }

        setIsResending(true);

        try {
            // Simulate resending verification email
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Reset to pending state
            setVerificationStatus('pending');
        } catch (error) {
            // Handle error silently or show toast
        } finally {
            setIsResending(false);
        }
    };

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    // Verification in progress
    if (isLoading && verificationStatus === 'pending') {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
                        <CardDescription>
                            Please wait while we verify your email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-8">
                        <Spinner size="lg" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Verification successful
    if (verificationStatus === 'success') {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Email verified!</CardTitle>
                        <CardDescription>
                            Your email address has been successfully verified
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            Welcome to your AI personal assistant! You'll be redirected to your dashboard in a few seconds.
                        </Text>

                        <Button
                            className="w-full"
                            onClick={handleGoToDashboard}
                        >
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Verification failed
    if (verificationStatus === 'error') {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Verification failed</CardTitle>
                        <CardDescription>
                            We couldn't verify your email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            The verification link may be invalid or corrupted. Please request a new verification email.
                        </Text>

                        <Button
                            className="w-full"
                            onClick={handleResendEmail}
                            disabled={isResending}
                        >
                            {isResending && <Spinner size="sm" className="mr-2" />}
                            {isResending ? 'Sending...' : 'Send new verification email'}
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

    // Verification expired
    if (verificationStatus === 'expired') {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                            <AlertCircle className="h-8 w-8 text-yellow-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Verification link expired</CardTitle>
                        <CardDescription>
                            This verification link has expired
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            Verification links expire after 24 hours for security reasons. Request a new one to continue.
                        </Text>

                        <Button
                            className="w-full"
                            onClick={handleResendEmail}
                            disabled={isResending}
                        >
                            {isResending && <Spinner size="sm" className="mr-2" />}
                            {isResending ? 'Sending...' : 'Send new verification email'}
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

    // Default state - awaiting verification (no token)
    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription>
                        We've sent a verification link to{' '}
                        {email && <span className="font-medium">{email}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            Click the link in the email to verify your account. The link will expire in 24 hours.
                        </Text>

                        <Text size="sm" className="text-muted-foreground">
                            Didn't receive the email? Check your spam folder or request a new one.
                        </Text>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleResendEmail}
                            disabled={isResending || !email}
                        >
                            {isResending && <Spinner size="sm" className="mr-2" />}
                            {isResending ? 'Sending...' : 'Resend verification email'}
                        </Button>
                    </div>

                    {/* Help Section */}
                    <div className="space-y-2 text-center">
                        <Text size="sm" className="text-muted-foreground">
                            Wrong email address?{' '}
                            <Link href="/sign-up" className="text-primary hover:underline">
                                Sign up again
                            </Link>
                        </Text>

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
