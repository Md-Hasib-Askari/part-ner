import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IconButton } from '@/components/atoms/buttons';
import { Text, Heading } from '@/components/atoms/typography';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    MoreHorizontal,
    LucideIcon
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    description?: string;
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
    onClick?: () => void;
    onMenuClick?: () => void;
    className?: string;
    loading?: boolean;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    variant = 'default',
    onClick,
    onMenuClick,
    className,
    loading = false,
}: StatCardProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'border-green-200 bg-green-50/50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50/50';
            case 'destructive':
                return 'border-red-200 bg-red-50/50';
            case 'info':
                return 'border-blue-200 bg-blue-50/50';
            default:
                return 'border-border bg-card';
        }
    };

    const getIconColor = () => {
        switch (variant) {
            case 'success':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'destructive':
                return 'text-red-600';
            case 'info':
                return 'text-blue-600';
            default:
                return 'text-muted-foreground';
        }
    };

    const getTrendIcon = () => {
        if (!trend) return null;

        if (trend.value > 0) {
            return <TrendingUp className="h-4 w-4" />;
        } else if (trend.value < 0) {
            return <TrendingDown className="h-4 w-4" />;
        } else {
            return <Minus className="h-4 w-4" />;
        }
    };

    const getTrendColor = () => {
        if (!trend) return 'text-muted-foreground';

        const isPositive = trend.isPositive ?? trend.value > 0;

        if (trend.value === 0) return 'text-muted-foreground';
        return isPositive ? 'text-green-600' : 'text-red-600';
    };

    if (loading) {
        return (
            <Card className={cn('animate-pulse', className)}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-6 w-6 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-8 w-20 bg-muted rounded" />
                        <div className="h-3 w-32 bg-muted rounded" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={cn(
                'transition-all duration-200 hover:shadow-md',
                getVariantStyles(),
                onClick && 'cursor-pointer hover:scale-105',
                className
            )}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Text size="sm" variant="muted" weight="medium" className="truncate">
                    {title}
                </Text>

                <div className="flex items-center gap-1">
                    {Icon && (
                        <Icon className={cn('h-5 w-5', getIconColor())} />
                    )}

                    {onMenuClick && (
                        <IconButton
                            icon="more"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onMenuClick();
                            }}
                            tooltip="More options"
                        />
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <Heading as="h3" size="2xl" weight="bold">
                        {value}
                    </Heading>

                    <div className="flex items-center justify-between">
                        {trend && (
                            <div className={cn('flex items-center gap-1', getTrendColor())}>
                                {getTrendIcon()}
                                <Text size="xs" weight="medium">
                                    {Math.abs(trend.value)}% {trend.label}
                                </Text>
                            </div>
                        )}

                        {description && (
                            <Text size="xs" variant="muted" className="truncate">
                                {description}
                            </Text>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Grid layout for multiple stat cards
interface StatCardsGridProps {
    cards: Array<StatCardProps & { id: string }>;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

export function StatCardsGrid({
    cards,
    columns = 4,
    className
}: StatCardsGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={cn('grid gap-4', gridCols[columns], className)}>
            {cards.map(({ id, ...cardProps }) => (
                <StatCard key={id} {...cardProps} />
            ))}
        </div>
    );
}

// Specialized stat card variants
interface MetricCardProps extends Omit<StatCardProps, 'variant'> {
    current: number;
    target?: number;
    unit?: string;
    showProgress?: boolean;
}

export function MetricCard({
    current,
    target,
    unit = '',
    showProgress = true,
    ...props
}: MetricCardProps) {
    const percentage = target ? Math.round((current / target) * 100) : 0;
    const isOnTrack = percentage >= 80;
    const variant = isOnTrack ? 'success' : percentage >= 60 ? 'warning' : 'destructive';

    return (
        <StatCard
            {...props}
            value={`${current.toLocaleString()}${unit}`}
            variant={variant}
            description={target ? `${percentage}% of ${target.toLocaleString()}${unit} target` : undefined}
        />
    );
}

interface ProgressCardProps extends Omit<StatCardProps, 'value' | 'variant'> {
    current: number;
    total: number;
    unit?: string;
    showPercentage?: boolean;
}

export function ProgressCard({
    current,
    total,
    unit = '',
    showPercentage = true,
    ...props
}: ProgressCardProps) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const displayValue = showPercentage ? `${percentage}%` : `${current}/${total}`;

    return (
        <div>
            <StatCard
                {...props}
                value={displayValue}
                description={`${current.toLocaleString()}${unit} of ${total.toLocaleString()}${unit}`}
            />
            {/* Progress bar */}
            <div className="mt-2 w-full bg-secondary rounded-full h-2">
                <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}

// Quick stats overview
interface QuickStatsProps {
    stats: Array<{
        label: string;
        value: string | number;
        change?: number;
    }>;
    className?: string;
}

export function QuickStats({ stats, className }: QuickStatsProps) {
    return (
        <div className={cn('flex items-center justify-between gap-4', className)}>
            {stats.map((stat, index) => (
                <div key={index} className="text-center">
                    <Heading as="h4" size="lg" weight="bold">
                        {stat.value}
                    </Heading>
                    <Text size="xs" variant="muted">
                        {stat.label}
                    </Text>
                    {stat.change !== undefined && (
                        <div className={cn(
                            'flex items-center justify-center gap-1 mt-1',
                            stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                        )}>
                            {stat.change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : stat.change < 0 ? (
                                <TrendingDown className="h-3 w-3" />
                            ) : (
                                <Minus className="h-3 w-3" />
                            )}
                            <Text size="xs" weight="medium">
                                {Math.abs(stat.change)}%
                            </Text>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
