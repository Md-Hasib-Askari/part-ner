import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Spinner Component
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Dots Loading Component
interface DotsLoadingProps {
    className?: string;
    dotClassName?: string;
}

export function DotsLoading({ className, dotClassName }: DotsLoadingProps) {
    return (
        <div className={cn('flex space-x-1', className)} role="status" aria-label="Loading">
            <div
                className={cn(
                    'h-2 w-2 animate-bounce rounded-full bg-current',
                    '[animation-delay:-0.3s]',
                    dotClassName
                )}
            />
            <div
                className={cn(
                    'h-2 w-2 animate-bounce rounded-full bg-current',
                    '[animation-delay:-0.15s]',
                    dotClassName
                )}
            />
            <div
                className={cn(
                    'h-2 w-2 animate-bounce rounded-full bg-current',
                    dotClassName
                )}
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Pulse Loading Component
interface PulseLoadingProps {
    className?: string;
}

export function PulseLoading({ className }: PulseLoadingProps) {
    return (
        <div
            className={cn(
                'h-4 w-4 animate-pulse rounded-full bg-current opacity-75',
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Loading Overlay Component
interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    className?: string;
}

export function LoadingOverlay({
    isLoading,
    children,
    loadingText = 'Loading...',
    className,
}: LoadingOverlayProps) {
    return (
        <div className={cn('relative', className)}>
            {children}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-2">
                        <Spinner size="lg" />
                        {loadingText && (
                            <p className="text-sm text-muted-foreground">{loadingText}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Skeleton Components for specific layouts
export function TaskCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-3 rounded-lg border p-4', className)}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    );
}

export function EmailSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-2 rounded-lg border p-4', className)}>
            <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
        </div>
    );
}

export function NotificationSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-start space-x-3 rounded-lg border p-3', className)}>
            <Skeleton className="h-6 w-6 rounded" />
            <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-3 w-12" />
        </div>
    );
}

export function StatCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-3 rounded-lg border p-6', className)}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
        </div>
    );
}

export function ChatMessageSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-start space-x-3 p-4', className)}>
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
            </div>
        </div>
    );
}

// Loading Button Component
interface LoadingButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function LoadingButton({
    isLoading,
    children,
    className,
    disabled,
    ...props
}: LoadingButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Spinner size="sm" />}
            {children}
        </button>
    );
}
