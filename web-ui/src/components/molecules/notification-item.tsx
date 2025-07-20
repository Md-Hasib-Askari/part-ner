import React from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/atoms/buttons';
import { Text } from '@/components/atoms/typography';
import { Notification } from '@/types';
import {
    Bell,
    CheckSquare,
    Mail,
    DollarSign,
    Shield,
    Settings,
    AlertCircle,
    Info,
    CheckCircle,
    X
} from 'lucide-react';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead?: (id: string) => void;
    onDismiss?: (id: string) => void;
    onAction?: (id: string) => void;
    className?: string;
    compact?: boolean;
}

export function NotificationItem({
    notification,
    onMarkAsRead,
    onDismiss,
    onAction,
    className,
    compact = false,
}: NotificationItemProps) {
    const getNotificationIcon = () => {
        const iconProps = { className: "h-5 w-5" };

        switch (notification.type) {
            case 'task':
                return <CheckSquare {...iconProps} />;
            case 'email':
                return <Mail {...iconProps} />;
            case 'finance':
                return <DollarSign {...iconProps} />;
            case 'security':
                return <Shield {...iconProps} />;
            case 'system':
                return <Settings {...iconProps} />;
            case 'reminder':
                return <Bell {...iconProps} />;
            default:
                return <Info {...iconProps} />;
        }
    };

    const getNotificationVariant = () => {
        switch (notification.priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'warning';
            case 'low':
            default:
                return 'info';
        }
    };

    const getIconBackground = () => {
        const baseClasses = "flex items-center justify-center rounded-full p-2";

        switch (notification.priority) {
            case 'high':
                return cn(baseClasses, "bg-red-100 text-red-600");
            case 'medium':
                return cn(baseClasses, "bg-yellow-100 text-yellow-600");
            case 'low':
            default:
                return cn(baseClasses, "bg-blue-100 text-blue-600");
        }
    };

    const handleMarkAsRead = () => {
        if (!notification.read) {
            onMarkAsRead?.(notification.id);
        }
    };

    const handleAction = () => {
        onAction?.(notification.id);
        handleMarkAsRead();
    };

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 border-b border-border transition-colors hover:bg-muted/50',
                !notification.read && 'bg-primary/5 border-l-4 border-l-primary',
                className
            )}
        >
            {/* Icon */}
            <div className={getIconBackground()}>
                {getNotificationIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <Text
                            size="sm"
                            weight={notification.read ? 'normal' : 'medium'}
                            className="leading-tight"
                        >
                            {notification.title}
                        </Text>

                        {!compact && (
                            <Text
                                size="sm"
                                variant="muted"
                                className="mt-1 line-clamp-2"
                            >
                                {notification.message}
                            </Text>
                        )}

                        <div className="flex items-center gap-4 mt-2">
                            <Text size="xs" variant="muted">
                                {formatRelativeTime(notification.timestamp)}
                            </Text>

                            {!notification.read && (
                                <button
                                    onClick={handleMarkAsRead}
                                    className="text-xs text-primary hover:text-primary/80 font-medium"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {notification.actionUrl && notification.actionLabel && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAction}
                                className="text-xs"
                            >
                                {notification.actionLabel}
                            </Button>
                        )}

                        {onDismiss && (
                            <IconButton
                                icon="close"
                                variant="ghost"
                                size="sm"
                                onClick={() => onDismiss(notification.id)}
                                tooltip="Dismiss"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Compact notification for dropdown/sidebar
export function NotificationItemCompact(props: NotificationItemProps) {
    return <NotificationItem {...props} compact={true} />;
}

// Notification toast variant
interface NotificationToastProps {
    notification: Notification;
    onDismiss?: (id: string) => void;
    onAction?: (id: string) => void;
    className?: string;
}

export function NotificationToast({
    notification,
    onDismiss,
    onAction,
    className,
}: NotificationToastProps) {
    const getToastIcon = () => {
        const iconProps = { className: "h-5 w-5" };

        switch (notification.priority) {
            case 'high':
                return <AlertCircle {...iconProps} className="text-red-600" />;
            case 'medium':
                return <Info {...iconProps} className="text-yellow-600" />;
            case 'low':
            default:
                return <CheckCircle {...iconProps} className="text-green-600" />;
        }
    };

    const getToastStyles = () => {
        switch (notification.priority) {
            case 'high':
                return 'border-red-200 bg-red-50';
            case 'medium':
                return 'border-yellow-200 bg-yellow-50';
            case 'low':
            default:
                return 'border-green-200 bg-green-50';
        }
    };

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm',
                getToastStyles(),
                className
            )}
        >
            {getToastIcon()}

            <div className="flex-1 min-w-0">
                <Text size="sm" weight="medium" className="leading-tight">
                    {notification.title}
                </Text>

                <Text size="sm" variant="muted" className="mt-1 line-clamp-2">
                    {notification.message}
                </Text>

                {notification.actionUrl && notification.actionLabel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAction?.(notification.id)}
                        className="mt-2 h-8 px-2 text-xs"
                    >
                        {notification.actionLabel}
                    </Button>
                )}
            </div>

            <IconButton
                icon="close"
                variant="ghost"
                size="sm"
                onClick={() => onDismiss?.(notification.id)}
                className="h-5 w-5 p-0"
            />
        </div>
    );
}

// Notification list wrapper
interface NotificationListProps {
    notifications: Notification[];
    onMarkAsRead?: (id: string) => void;
    onDismiss?: (id: string) => void;
    onAction?: (id: string) => void;
    onMarkAllAsRead?: () => void;
    onClearAll?: () => void;
    className?: string;
    emptyMessage?: string;
}

export function NotificationList({
    notifications,
    onMarkAsRead,
    onDismiss,
    onAction,
    onMarkAllAsRead,
    onClearAll,
    className,
    emptyMessage = "No notifications",
}: NotificationListProps) {
    const unreadCount = notifications.filter(n => !n.read).length;

    if (notifications.length === 0) {
        return (
            <div className={cn('flex flex-col items-center justify-center p-8', className)}>
                <Bell className="h-12 w-12 text-muted-foreground/50" />
                <Text variant="muted" className="mt-2">
                    {emptyMessage}
                </Text>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col', className)}>
            {/* Header with actions */}
            {(onMarkAllAsRead || onClearAll) && unreadCount > 0 && (
                <div className="flex items-center justify-between p-4 border-b">
                    <Text size="sm" variant="muted">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </Text>

                    <div className="flex gap-2">
                        {onMarkAllAsRead && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onMarkAllAsRead}
                                className="text-xs"
                            >
                                Mark all read
                            </Button>
                        )}

                        {onClearAll && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearAll}
                                className="text-xs text-muted-foreground"
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Notification items */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={onMarkAsRead}
                        onDismiss={onDismiss}
                        onAction={onAction}
                    />
                ))}
            </div>
        </div>
    );
}
