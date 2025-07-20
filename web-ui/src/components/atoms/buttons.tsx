import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Bell,
    Home,
    CheckSquare,
    Mail,
    FolderOpen,
    DollarSign,
    Shield,
    MessageCircle,
    Settings,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Download,
    Upload,
    RefreshCw,
    Eye,
    EyeOff,
    Moon,
    Sun,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    ArrowLeft,
    ArrowRight,
    Check,
    AlertCircle,
    Info,
    HelpCircle,
    ExternalLink,
    Mic,
    MicOff,
    Paperclip,
    Copy,
    List,
    Grid3X3,
    SortAsc,
    SortDesc
} from 'lucide-react';

// Icon mapping for easy access
export const icons = {
    // Navigation
    home: Home,
    tasks: CheckSquare,
    email: Mail,
    files: FolderOpen,
    finance: DollarSign,
    security: Shield,
    chat: MessageCircle,
    settings: Settings,

    // Actions
    add: Plus,
    search: Search,
    filter: Filter,
    more: MoreHorizontal,
    edit: Edit,
    delete: Trash2,
    download: Download,
    upload: Upload,
    refresh: RefreshCw,

    // UI
    menu: Menu,
    close: X,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronUp: ChevronUp,
    chevronDown: ChevronDown,
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,

    // Status
    check: Check,
    alert: AlertCircle,
    info: Info,
    help: HelpCircle,
    external: ExternalLink,

    // Theme
    moon: Moon,
    sun: Sun,

    // Visibility
    show: Eye,
    hide: EyeOff,

    // Notifications
    bell: Bell,

    // Media
    mic: Mic,
    micOff: MicOff,
    paperclip: Paperclip,
    copy: Copy,

    // Layout
    list: List,
    grid: Grid3X3,
    sortAsc: SortAsc,
    sortDesc: SortDesc,
};

type IconName = keyof typeof icons;

interface IconButtonProps {
    icon: IconName;
    onClick?: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
    tooltip?: string;
}

export function IconButton({
    icon,
    onClick,
    variant = 'ghost',
    size = 'icon',
    className,
    disabled = false,
    tooltip,
}: IconButtonProps) {
    const Icon = icons[icon];

    return (
        <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={cn(className)}
            title={tooltip}
        >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{tooltip || icon}</span>
        </Button>
    );
}

interface ActionButtonProps {
    icon: IconName;
    label: string;
    onClick?: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
}

export function ActionButton({
    icon,
    label,
    onClick,
    variant = 'default',
    size = 'default',
    className,
    disabled = false,
    loading = false,
}: ActionButtonProps) {
    const Icon = icons[icon];

    return (
        <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn('gap-2', className)}
        >
            {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <Icon className="h-4 w-4" />
            )}
            {label}
        </Button>
    );
}

interface FloatingActionButtonProps {
    icon: IconName;
    onClick?: () => void;
    className?: string;
    tooltip?: string;
}

export function FloatingActionButton({
    icon,
    onClick,
    className,
    tooltip,
}: FloatingActionButtonProps) {
    const Icon = icons[icon];

    return (
        <Button
            size="icon"
            onClick={onClick}
            className={cn(
                'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50',
                className
            )}
            title={tooltip}
        >
            <Icon className="h-6 w-6" />
            <span className="sr-only">{tooltip || icon}</span>
        </Button>
    );
}
