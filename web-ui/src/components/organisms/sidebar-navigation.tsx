import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/atoms/avatars';
import { IconButton } from '@/components/atoms/buttons';
import { Text, Heading } from '@/components/atoms/typography';
import { StatusBadge } from '@/components/atoms/badges';
import { useAppStore, useTaskStore, useEmailStore, useNotificationStore } from '@/store';
import {
    Home,
    CheckSquare,
    Mail,
    FolderOpen,
    DollarSign,
    Shield,
    MessageCircle,
    Settings,
    Bell,
    ChevronDown,
    ChevronRight,
    Plus,
    Search
} from 'lucide-react';

interface NavigationItem {
    id: string;
    label: string;
    icon: any;
    href: string;
    badge?: number;
    submenu?: NavigationItem[];
    isActive?: boolean;
}

interface SidebarNavigationProps {
    className?: string;
    onNavigate?: (href: string) => void;
}

export function SidebarNavigation({ className, onNavigate }: SidebarNavigationProps) {
    const { user, sidebarCollapsed, setSidebarCollapsed, currentPage, setCurrentPage } = useAppStore();
    const { tasks } = useTaskStore();
    const { unreadCount } = useEmailStore();
    const { notifications } = useNotificationStore();

    const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['main']);

    // Calculate badges for navigation items
    const pendingTasks = tasks.filter(task => task.status === 'todo').length;
    const unreadNotifications = notifications.filter(notification => !notification.read).length;

    const navigationItems: NavigationItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            href: '/dashboard',
            isActive: currentPage === 'dashboard'
        },
        {
            id: 'tasks',
            label: 'Tasks',
            icon: CheckSquare,
            href: '/tasks',
            badge: pendingTasks,
            isActive: currentPage === 'tasks'
        },
        {
            id: 'email',
            label: 'Email',
            icon: Mail,
            href: '/email',
            badge: unreadCount,
            isActive: currentPage === 'email'
        },
        {
            id: 'files',
            label: 'Files',
            icon: FolderOpen,
            href: '/files',
            isActive: currentPage === 'files'
        },
        {
            id: 'finance',
            label: 'Finance',
            icon: DollarSign,
            href: '/finance',
            isActive: currentPage === 'finance'
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            href: '/security',
            isActive: currentPage === 'security'
        },
        {
            id: 'chat',
            label: 'AI Assistant',
            icon: MessageCircle,
            href: '/chat',
            isActive: currentPage === 'chat'
        }
    ];

    const bottomNavigationItems: NavigationItem[] = [
        {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            href: '/notifications',
            badge: unreadNotifications,
            isActive: currentPage === 'notifications'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            href: '/settings',
            isActive: currentPage === 'settings'
        }
    ];

    const handleNavigation = (item: NavigationItem) => {
        setCurrentPage(item.id);
        onNavigate?.(item.href);
        console.log(`Navigating to ${item.href}`);

    };

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const renderNavigationItem = (item: NavigationItem, level = 0) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedMenus.includes(item.id);
        const IconComponent = item.icon;

        return (
            <div key={item.id} className="space-y-1">
                <Button
                    variant={item.isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                        "w-full justify-start h-10 px-3",
                        level > 0 && "ml-4 w-[calc(100%-1rem)]",
                        sidebarCollapsed && "justify-center px-2"
                    )}
                    onClick={() => hasSubmenu ? toggleMenu(item.id) : handleNavigation(item)}
                >
                    <IconComponent className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
                    {!sidebarCollapsed && (
                        <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <div className="ml-auto">
                                    <div className="h-5 min-w-[20px] px-1.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </div>
                                </div>
                            )}
                            {hasSubmenu && (
                                <div className="ml-2">
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </Button>

                {hasSubmenu && isExpanded && !sidebarCollapsed && (
                    <div className="space-y-1">
                        {item.submenu!.map(subItem => renderNavigationItem(subItem, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={cn(
            'flex flex-col h-full bg-background border-r transition-all duration-300',
            sidebarCollapsed ? 'w-16' : 'w-64',
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                {!sidebarCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <Heading as="h2" size="sm">AI Assistant</Heading>
                            <Text size="xs" variant="muted">Personal Dashboard</Text>
                        </div>
                    </div>
                )}
                <IconButton
                    icon="menu"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    tooltip={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                />
            </div>

            {/* User Profile */}
            {!sidebarCollapsed && user && (
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} size="md" />
                        <div className="flex-1 min-w-0">
                            <Text weight="medium" className="truncate">{user.name}</Text>
                            <Text size="sm" variant="muted" className="truncate">{user.email}</Text>
                        </div>
                        <IconButton icon="settings" size="sm" tooltip="Profile settings" />
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {!sidebarCollapsed && (
                <div className="p-4 border-b">
                    <Text size="sm" weight="medium" className="mb-3">Quick Actions</Text>
                    <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                            <Plus className="h-3 w-3 mr-1" />
                            Task
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                            <Search className="h-3 w-3 mr-1" />
                            Search
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                            <FolderOpen className="h-3 w-3 mr-1" />
                            Files
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    {!sidebarCollapsed && (
                        <Text size="xs" weight="medium" variant="muted" className="px-3 py-2 uppercase tracking-wider">
                            Main
                        </Text>
                    )}
                    {navigationItems.map(item => renderNavigationItem(item))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="p-2 border-t">
                <div className="space-y-1">
                    {bottomNavigationItems.map(item => renderNavigationItem(item))}
                </div>
            </div>

            {/* Status Indicator */}
            {!sidebarCollapsed && (
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <Text size="xs" variant="muted">System Online</Text>
                        <div className="ml-auto">
                            <StatusBadge status="completed" />
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed Navigation Tooltips */}
            {sidebarCollapsed && (
                <div className="absolute left-16 top-0 pointer-events-none">
                    {/* Tooltip content would be rendered here when hovering over collapsed items */}
                </div>
            )}
        </div>
    );
}
