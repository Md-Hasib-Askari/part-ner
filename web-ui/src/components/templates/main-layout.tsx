"use client";

import React, { useState } from 'react';
import { useAppStore, useNotificationStore } from '@/store';
import { SidebarNavigation } from '@/components/organisms/sidebar-navigation';
import { NotificationList } from '@/components/molecules/notification-item';
import { useTheme } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bell, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
    children: React.ReactNode;
    className?: string;
    showSidebar?: boolean;
    showNotifications?: boolean;
}

export function MainLayout({
    children,
    className,
    showSidebar = true,
    showNotifications = true,
}: MainLayoutProps) {
    const { theme } = useTheme();
    const { user, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
    const { notifications, markAsRead, removeNotification, markAllAsRead, clearAll } = useNotificationStore();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={cn(
            "min-h-screen bg-background transition-colors duration-300",
            theme === 'dark' ? 'dark' : '',
            className
        )}>
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 border-b bg-background/95 sticky top-0 z-50"
                style={{ backdropFilter: 'blur(8px)' }}>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80">
                        {showSidebar && (
                            <SidebarNavigation
                                className="h-full border-0"
                                onNavigate={(href: string) => { router.push(href); }}
                            />
                        )}
                    </SheetContent>
                </Sheet>

                <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-semibold">AI Assistant</h1>
                </div>

                <div className="flex items-center space-x-2">
                    {showNotifications && (
                        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                    <span className="sr-only">Notifications</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <NotificationList
                                    notifications={notifications}
                                    onMarkAsRead={markAsRead}
                                    onDismiss={removeNotification}
                                    onMarkAllAsRead={markAllAsRead}
                                    onClearAll={clearAll}
                                />
                            </SheetContent>
                        </Sheet>
                    )}

                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">User menu</span>
                    </Button>
                </div>
            </header>

            <div className="flex h-screen">
                {/* Desktop Sidebar */}
                {showSidebar && (
                    <aside className={cn(
                        "hidden lg:flex flex-col transition-all duration-300 ease-in-out border-r bg-background/95",
                        sidebarCollapsed ? "w-16" : "w-80"
                    )}
                        style={{ backdropFilter: 'blur(8px)' }}>
                        <SidebarNavigation
                            onNavigate={(href: string) => { router.push(href); }}
                        />
                    </aside>
                )}

                {/* Main Content Area */}
                <main className={cn(
                    "flex-1 flex flex-col min-h-0 overflow-hidden",
                    showSidebar && !sidebarCollapsed ? "lg:ml-0" : "",
                    !showSidebar ? "w-full" : ""
                )}>
                    {/* Desktop Header */}
                    <header className="hidden lg:flex items-center justify-between p-4 border-b bg-background/95 sticky top-0 z-40"
                        style={{ backdropFilter: 'blur(8px)' }}>
                        <div className="flex items-center space-x-4">
                            {showSidebar && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle sidebar</span>
                                </Button>
                            )}
                            <div className="flex items-center space-x-2">
                                <h1 className="text-xl font-semibold">AI-Powered Assistant</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Quick Actions */}
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                    Quick Actions
                                </Button>
                            </div>

                            {/* Notifications */}
                            {showNotifications && (
                                <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative">
                                            <Bell className="h-5 w-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                            <span className="sr-only">Notifications</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-96">
                                        <NotificationList
                                            notifications={notifications}
                                            onMarkAsRead={markAsRead}
                                            onDismiss={removeNotification}
                                            onMarkAllAsRead={markAllAsRead}
                                            onClearAll={clearAll}
                                        />
                                    </SheetContent>
                                </Sheet>
                            )}

                            {/* Settings */}
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Button>

                            {/* User Profile */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-auto p-4 lg:p-6">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Navigation Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-background/80 z-40"
                    style={{ backdropFilter: 'blur(4px)' }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}

// Layout variants for specific use cases
export function MainLayoutMinimal({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <MainLayout
            showSidebar={false}
            showNotifications={false}
            className={className}
        >
            {children}
        </MainLayout>
    );
}

export function MainLayoutWithoutNotifications({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <MainLayout
            showNotifications={false}
            className={className}
        >
            {children}
        </MainLayout>
    );
}

export default MainLayout;
