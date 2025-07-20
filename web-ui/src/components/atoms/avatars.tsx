import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallbackClassName?: string;
}

export function UserAvatar({
    src,
    alt,
    name,
    size = 'md',
    className,
    fallbackClassName,
}: UserAvatarProps) {
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
    };

    // Generate initials from name
    const getInitials = (name?: string): string => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    // Generate consistent color based on name
    const getAvatarColor = (name?: string): string => {
        if (!name) return 'bg-muted';

        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
            'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500',
        ];

        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        return colors[Math.abs(hash) % colors.length];
    };

    const initials = getInitials(name);
    const colorClass = getAvatarColor(name);

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            <AvatarImage src={src} alt={alt || name} />
            <AvatarFallback
                className={cn(
                    'font-medium text-white',
                    colorClass,
                    fallbackClassName
                )}
            >
                {initials || <User className="h-1/2 w-1/2" />}
            </AvatarFallback>
        </Avatar>
    );
}

interface AvatarGroupProps {
    users: Array<{
        id: string;
        name?: string;
        avatar?: string;
    }>;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function AvatarGroup({ users, max = 4, size = 'md', className }: AvatarGroupProps) {
    const visibleUsers = users.slice(0, max);
    const remainingCount = users.length - max;

    const sizeClasses = {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const negativeMarginClasses = {
        xs: '-ml-2',
        sm: '-ml-2',
        md: '-ml-3',
        lg: '-ml-3',
        xl: '-ml-4',
    };

    return (
        <div className={cn('flex items-center', className)}>
            {visibleUsers.map((user, index) => (
                <div
                    key={user.id}
                    className={cn(
                        'relative rounded-full border-2 border-background',
                        index > 0 && negativeMarginClasses[size]
                    )}
                    style={{ zIndex: visibleUsers.length - index }}
                >
                    <UserAvatar
                        src={user.avatar}
                        name={user.name}
                        size={size}
                        className="border-0"
                    />
                </div>
            ))}

            {remainingCount > 0 && (
                <div
                    className={cn(
                        'relative flex items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground font-medium',
                        sizeClasses[size],
                        negativeMarginClasses[size]
                    )}
                    style={{ zIndex: 0 }}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

interface StatusAvatarProps extends UserAvatarProps {
    status?: 'online' | 'offline' | 'away' | 'busy';
    showStatus?: boolean;
}

export function StatusAvatar({
    status = 'offline',
    showStatus = true,
    ...avatarProps
}: StatusAvatarProps) {
    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
    };

    const getStatusSize = (size: string) => {
        switch (size) {
            case 'xs':
                return 'h-2 w-2';
            case 'sm':
                return 'h-2.5 w-2.5';
            case 'md':
                return 'h-3 w-3';
            case 'lg':
                return 'h-3.5 w-3.5';
            case 'xl':
                return 'h-4 w-4';
            default:
                return 'h-3 w-3';
        }
    };

    return (
        <div className="relative inline-block">
            <UserAvatar {...avatarProps} />
            {showStatus && (
                <div
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-background',
                        statusColors[status],
                        getStatusSize(avatarProps.size || 'md')
                    )}
                />
            )}
        </div>
    );
}

interface UploadAvatarProps {
    currentSrc?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    onImageChange?: (file: File) => void;
    className?: string;
    disabled?: boolean;
}

export function UploadAvatar({
    currentSrc,
    name,
    size = 'xl',
    onImageChange,
    className,
    disabled = false,
}: UploadAvatarProps) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onImageChange) {
            onImageChange(file);
        }
    };

    return (
        <div className={cn('relative group', className)}>
            <UserAvatar
                src={currentSrc}
                name={name}
                size={size}
                className="transition-opacity group-hover:opacity-75"
            />

            {!disabled && (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        id="avatar-upload"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="rounded-full bg-black/50 p-2 text-white">
                            <User className="h-4 w-4" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Avatar with dropdown menu for user actions
interface AvatarMenuProps extends UserAvatarProps {
    menuItems?: Array<{
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
        destructive?: boolean;
    }>;
}

export function AvatarMenu({ menuItems = [], ...avatarProps }: AvatarMenuProps) {
    return (
        <div className="relative group">
            <button className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <UserAvatar {...avatarProps} />
            </button>

            {menuItems.length > 0 && (
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block">
                    <div className="rounded-md border bg-popover p-1 shadow-md">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent',
                                    item.destructive && 'text-destructive'
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
