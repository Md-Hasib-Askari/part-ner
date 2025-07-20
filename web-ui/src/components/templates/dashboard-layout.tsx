"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from './main-layout';
import { DashboardStats } from '@/components/organisms/dashboard-stats';
import { StatCard } from '@/components/molecules/stat-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAppStore, useTaskStore, useEmailStore, useFinanceStore } from '@/store';
import { Plus, Activity, TrendingUp, Calendar, Filter, CheckSquare, Mail, DollarSign, Clock } from 'lucide-react';

interface DashboardLayoutProps {
    children?: React.ReactNode;
    className?: string;
    showQuickStats?: boolean;
    showQuickActions?: boolean;
    defaultTab?: string;
}

export function DashboardLayout({
    children,
    className,
    showQuickStats = true,
    showQuickActions = true,
    defaultTab = "overview"
}: DashboardLayoutProps) {
    const { user } = useAppStore();
    const { tasks } = useTaskStore();
    const { emails } = useEmailStore();
    const { transactions } = useFinanceStore();

    // State for hydration-safe values
    const [isClient, setIsClient] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState('');
    const [completedTasksToday, setCompletedTasksToday] = useState(0);
    const [unreadEmails, setUnreadEmails] = useState(0);
    const [todayExpenses, setTodayExpenses] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);

    // Helper function to check if date is today (client-side only)
    const isToday = (date: Date): boolean => {
        if (!isClient) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Calculate time-based greeting (client-side only)
    const calculateTimeOfDay = (): string => {
        if (!isClient) return '';
        const hour = new Date().getHours();

        if (hour < 12) {
            return 'morning';
        } else if (hour < 17) {
            return 'afternoon';
        } else {
            return 'evening';
        }
    };

    // Effect to set client-side only values after hydration
    useEffect(() => {
        setIsClient(true);
        setTimeOfDay(calculateTimeOfDay());

        // Calculate stats only on client side
        const completedToday = tasks.filter(task =>
            task.status === 'completed' &&
            task.updatedAt && isToday(new Date(task.updatedAt))
        ).length;

        const unread = emails.filter(email => !email.readAt).length;

        const expensesToday = transactions
            .filter(transaction =>
                transaction.type === 'expense' &&
                isToday(new Date(transaction.date))
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const pending = tasks.filter(task => task.status === 'todo').length;

        setCompletedTasksToday(completedToday);
        setUnreadEmails(unread);
        setTodayExpenses(expensesToday);
        setPendingTasks(pending);
    }, [tasks, emails, transactions, isClient]); return (
        <MainLayout className={className}>
            <div className="space-y-6">
                {/* Dashboard Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">
                            Good {timeOfDay || 'day'}, {user?.name || 'User'}! 👋
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Here's what's happening with your AI assistant today.
                        </p>
                    </div>                    {showQuickActions && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                Schedule
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Activity className="h-4 w-4" />
                                Activity
                            </Button>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Quick Action
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                {showQuickStats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Tasks Completed"
                            value={completedTasksToday.toString()}
                            description="Today"
                            trend={{ value: 12, label: "+12%", isPositive: true }}
                            variant="success"
                            icon={CheckSquare}
                        />
                        <StatCard
                            title="Unread Emails"
                            value={unreadEmails.toString()}
                            description="Requires attention"
                            trend={{ value: -5, label: "-5%", isPositive: true }}
                            variant="warning"
                            icon={Mail}
                        />
                        <StatCard
                            title="Today's Expenses"
                            value={`$${todayExpenses.toFixed(2)}`}
                            description="vs yesterday"
                            trend={{ value: -8, label: "-8%", isPositive: true }}
                            variant="default"
                            icon={DollarSign}
                        />
                        <StatCard
                            title="Pending Tasks"
                            value={pendingTasks.toString()}
                            description="Due this week"
                            trend={{ value: 3, label: "+3", isPositive: false }}
                            variant="destructive"
                            icon={Clock}
                        />
                    </div>
                )}

                {/* Dashboard Content Tabs */}
                <Tabs defaultValue={defaultTab} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TabsList className="grid w-full max-w-md grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                    </div>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Main Dashboard Stats Component */}
                        <DashboardStats />

                        {/* Custom Content */}
                        {children && (
                            <div className={cn("space-y-6", className)}>
                                {children}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid gap-6">
                            <div className="rounded-lg border p-6">
                                <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
                                <p className="text-muted-foreground">
                                    Detailed analytics view coming soon...
                                </p>
                            </div>
                            {children && (
                                <div className={cn("space-y-6", className)}>
                                    {children}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                        <div className="grid gap-6">
                            <div className="rounded-lg border p-6">
                                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                                <p className="text-muted-foreground">
                                    Activity timeline coming soon...
                                </p>
                            </div>
                            {children && (
                                <div className={cn("space-y-6", className)}>
                                    {children}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid gap-6">
                            <div className="rounded-lg border p-6">
                                <h3 className="text-lg font-semibold mb-4">Dashboard Settings</h3>
                                <p className="text-muted-foreground">
                                    Customization options coming soon...
                                </p>
                            </div>
                            {children && (
                                <div className={cn("space-y-6", className)}>
                                    {children}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}

// Helper function to get time-based greeting
function getTimeOfDay(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'morning';
    } else if (hour < 17) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}// Layout variants for specific dashboard views
export function DashboardLayoutMinimal({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <DashboardLayout
            showQuickStats={false}
            showQuickActions={false}
            className={className}
        >
            {children}
        </DashboardLayout>
    );
}

export function DashboardLayoutFocused({
    children,
    className,
    tab = "overview"
}: {
    children: React.ReactNode;
    className?: string;
    tab?: string;
}) {
    return (
        <DashboardLayout
            defaultTab={tab}
            className={className}
        >
            {children}
        </DashboardLayout>
    );
}

export default DashboardLayout;
