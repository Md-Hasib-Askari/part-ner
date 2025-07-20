import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusConfig = {
        todo: {
            label: 'To Do',
            variant: 'secondary' as const,
            className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        },
        'in-progress': {
            label: 'In Progress',
            variant: 'default' as const,
            className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        },
        completed: {
            label: 'Completed',
            variant: 'default' as const,
            className: 'bg-green-100 text-green-700 hover:bg-green-200',
        },
        cancelled: {
            label: 'Cancelled',
            variant: 'destructive' as const,
            className: 'bg-red-100 text-red-700 hover:bg-red-200',
        },
    };

    const config = statusConfig[status];

    return (
        <Badge
            variant={config.variant}
            className={cn(config.className, className)}
        >
            {config.label}
        </Badge>
    );
}

interface PriorityBadgeProps {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const priorityConfig = {
        low: {
            label: 'Low',
            className: 'bg-green-100 text-green-700 border-green-200',
        },
        medium: {
            label: 'Medium',
            className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        },
        high: {
            label: 'High',
            className: 'bg-orange-100 text-orange-700 border-orange-200',
        },
        urgent: {
            label: 'Urgent',
            className: 'bg-red-100 text-red-700 border-red-200',
        },
    };

    const config = priorityConfig[priority];

    return (
        <Badge
            variant="outline"
            className={cn(config.className, className)}
        >
            {config.label}
        </Badge>
    );
}

interface CategoryBadgeProps {
    category: string;
    className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    const categoryColors = {
        personal: 'bg-purple-100 text-purple-700 border-purple-200',
        work: 'bg-blue-100 text-blue-700 border-blue-200',
        health: 'bg-pink-100 text-pink-700 border-pink-200',
        finance: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        learning: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        other: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.other;

    return (
        <Badge
            variant="outline"
            className={cn(colorClass, className)}
        >
            {category}
        </Badge>
    );
}
