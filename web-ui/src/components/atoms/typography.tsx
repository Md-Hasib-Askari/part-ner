import React from 'react';
import { cn } from '@/lib/utils';

// Heading Components
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    variant?: 'default' | 'gradient' | 'muted';
}

export function Heading({
    children,
    as = 'h2',
    size,
    weight = 'semibold',
    variant = 'default',
    className,
    ...props
}: HeadingProps) {
    const Component = as;

    // Default sizes for each heading level
    const defaultSizes: Record<string, keyof typeof sizeClasses> = {
        h1: '3xl',
        h2: '2xl',
        h3: 'xl',
        h4: 'lg',
        h5: 'md',
        h6: 'sm',
    };

    const actualSize = size || defaultSizes[as];

    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
    };

    const weightClasses = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    };

    const variantClasses = {
        default: 'text-foreground',
        gradient: 'bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent',
        muted: 'text-muted-foreground',
    };

    return (
        <Component
            className={cn(
                sizeClasses[actualSize],
                weightClasses[weight],
                variantClasses[variant],
                'leading-tight tracking-tight',
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

// Text Component
interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    as?: 'p' | 'span' | 'div';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    variant?: 'default' | 'muted' | 'accent' | 'destructive' | 'success' | 'warning';
    truncate?: boolean;
    maxLines?: number;
}

export function Text({
    children,
    as = 'p',
    size = 'md',
    weight = 'normal',
    variant = 'default',
    truncate = false,
    maxLines,
    className,
    ...props
}: TextProps) {
    const Component = as;

    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    const weightClasses = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    };

    const variantClasses = {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        accent: 'text-accent-foreground',
        destructive: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
    };

    const truncateClasses = truncate ? 'truncate' : '';
    const maxLinesClasses = maxLines
        ? `line-clamp-${maxLines}`
        : '';

    return (
        <Component
            className={cn(
                sizeClasses[size],
                weightClasses[weight],
                variantClasses[variant],
                truncateClasses,
                maxLinesClasses,
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

// Code Component
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    variant?: 'inline' | 'block';
    language?: string;
}

export function Code({
    children,
    variant = 'inline',
    language,
    className,
    ...props
}: CodeProps) {
    if (variant === 'block') {
        return (
            <pre
                className={cn(
                    'overflow-x-auto rounded-lg border bg-muted p-4 text-sm',
                    className
                )}
                {...props}
            >
                <code className="font-mono">{children}</code>
            </pre>
        );
    }

    return (
        <code
            className={cn(
                'relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm',
                className
            )}
            {...props}
        >
            {children}
        </code>
    );
}

// Quote Component
interface QuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
    children: React.ReactNode;
    author?: string;
    variant?: 'default' | 'bordered' | 'emphasized';
}

export function Quote({
    children,
    author,
    variant = 'default',
    className,
    ...props
}: QuoteProps) {
    const variantClasses = {
        default: 'border-l-4 border-muted pl-4 italic',
        bordered: 'border rounded-lg p-4 bg-muted/50 italic',
        emphasized: 'border-l-4 border-primary pl-4 bg-primary/5 p-4 italic',
    };

    return (
        <blockquote
            className={cn(variantClasses[variant], className)}
            {...props}
        >
            <Text className="text-muted-foreground">{children}</Text>
            {author && (
                <footer className="mt-2">
                    <Text size="sm" variant="muted">
                        — {author}
                    </Text>
                </footer>
            )}
        </blockquote>
    );
}

// List Components
interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
    children: React.ReactNode;
    variant?: 'unordered' | 'ordered';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function List({
    children,
    variant = 'unordered',
    spacing = 'sm',
    className,
    ...props
}: ListProps) {
    const Component = variant === 'ordered' ? 'ol' : 'ul';

    const spacingClasses = {
        none: 'space-y-0',
        sm: 'space-y-1',
        md: 'space-y-2',
        lg: 'space-y-3',
    };

    const listClasses = variant === 'ordered'
        ? 'list-decimal list-inside'
        : 'list-disc list-inside';

    return (
        <Component
            className={cn(
                listClasses,
                spacingClasses[spacing],
                'text-foreground',
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

// Link Component
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    variant?: 'default' | 'muted' | 'destructive';
    underline?: 'none' | 'hover' | 'always';
    external?: boolean;
}

export function Link({
    children,
    variant = 'default',
    underline = 'hover',
    external = false,
    className,
    ...props
}: LinkProps) {
    const variantClasses = {
        default: 'text-primary hover:text-primary/80',
        muted: 'text-muted-foreground hover:text-foreground',
        destructive: 'text-destructive hover:text-destructive/80',
    };

    const underlineClasses = {
        none: 'no-underline',
        hover: 'hover:underline',
        always: 'underline',
    };

    return (
        <a
            className={cn(
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
                variantClasses[variant],
                underlineClasses[underline],
                className
            )}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            {...props}
        >
            {children}
        </a>
    );
}

// Badge Text (for small indicators)
interface BadgeTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
    size?: 'sm' | 'md';
}

export function BadgeText({
    children,
    variant = 'default',
    size = 'sm',
    className,
    ...props
}: BadgeTextProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
    };

    const variantClasses = {
        default: 'bg-muted text-muted-foreground',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        destructive: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full font-medium',
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// Keyboard Key Display
interface KbdProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function Kbd({ children, className, ...props }: KbdProps) {
    return (
        <kbd
            className={cn(
                'inline-flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-xs text-muted-foreground',
                className
            )}
            {...props}
        >
            {children}
        </kbd>
    );
}

// Highlight Text
interface HighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'warning' | 'success';
}

export function Highlight({
    children,
    variant = 'default',
    className,
    ...props
}: HighlightProps) {
    const variantClasses = {
        default: 'bg-yellow-200 text-yellow-900',
        primary: 'bg-primary/20 text-primary-foreground',
        warning: 'bg-orange-200 text-orange-900',
        success: 'bg-green-200 text-green-900',
    };

    return (
        <span
            className={cn(
                'px-1 py-0.5 rounded',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
