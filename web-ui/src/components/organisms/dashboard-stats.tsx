import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/molecules/stat-card';
import { Text } from '@/components/atoms/typography';
import { formatCurrency } from '@/lib/utils';
import { useAppStore, useTaskStore, useEmailStore, useFinanceStore, useNotificationStore } from '@/store';
import {
    CheckSquare,
    Mail,
    DollarSign,
    Shield,
    Bell,
    Clock,
    AlertTriangle,
    Activity
} from 'lucide-react';

interface DashboardStatsProps {
    className?: string;
    showDetailed?: boolean;
}

export function DashboardStats({ className, showDetailed = false }: DashboardStatsProps) {
    const [isClient, setIsClient] = useState(false);
    const [formattedLastUpdated, setFormattedLastUpdated] = useState<string>('Never');

    const { systemHealth, lastUpdated } = useAppStore();
    const { tasks } = useTaskStore();
    const { emails, unreadCount } = useEmailStore();
    const { transactions, balance } = useFinanceStore();
    const { notifications } = useNotificationStore();

    // Handle client-side hydration for date formatting
    useEffect(() => {
        setIsClient(true);
        if (lastUpdated) {
            setFormattedLastUpdated(new Date(lastUpdated).toLocaleString());
        }
    }, [lastUpdated]);

    // Calculate task statistics
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Calculate email statistics
    const importantEmails = emails.filter(email => email.importance === 'high').length;
    const actionRequiredEmails = emails.filter(email => email.actionRequired).length;

    // Calculate financial statistics (client-side only to prevent hydration issues)
    const todayTransactions = isClient ? transactions.filter(transaction => {
        const today = new Date();
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === today.toDateString();
    }).length : 0;

    const monthlyExpenses = isClient ? transactions
        .filter(transaction => {
            const now = new Date();
            const transactionDate = new Date(transaction.date);
            return transaction.type === 'expense' &&
                transactionDate.getMonth() === now.getMonth() &&
                transactionDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0) : 0;

    // Calculate notification statistics
    const unreadNotifications = notifications.filter(notification => !notification.read).length;
    const criticalNotifications = notifications.filter(notification => notification.priority === 'high').length;

    const getSystemHealthColor = (health: number) => {
        if (health >= 90) return 'text-green-600';
        if (health >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getSystemHealthStatus = (health: number) => {
        if (health >= 90) return 'Excellent';
        if (health >= 70) return 'Good';
        if (health >= 50) return 'Fair';
        return 'Poor';
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tasks"
                    value={tasks.length}
                    icon={CheckSquare}
                    trend={{
                        value: taskCompletionRate,
                        label: `${completedTasks} completed`,
                        isPositive: taskCompletionRate > 50
                    }}
                />

                <StatCard
                    title="Emails"
                    value={unreadCount}
                    icon={Mail}
                    trend={{
                        value: 15,
                        label: `${importantEmails} important`,
                        isPositive: false
                    }}
                />

                <StatCard
                    title="Balance"
                    value={formatCurrency(balance)}
                    icon={DollarSign}
                    trend={{
                        value: 2.5,
                        label: `${todayTransactions} today`,
                        isPositive: true
                    }}
                />

                <StatCard
                    title="Alerts"
                    value={unreadNotifications}
                    icon={Bell}
                    trend={{
                        value: 2,
                        label: `${criticalNotifications} critical`,
                        isPositive: false
                    }}
                />
            </div>

            {/* System Health & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text size="xl" weight="bold" className={getSystemHealthColor(systemHealth)}>
                                    {systemHealth}%
                                </Text>
                                <div className={cn('px-2 py-1 rounded-full text-xs font-medium',
                                    systemHealth >= 90 ? 'bg-green-100 text-green-700' :
                                        systemHealth >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                )}>
                                    {getSystemHealthStatus(systemHealth)}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>CPU Usage</span>
                                    <span>45%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Memory Usage</span>
                                    <span>62%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Storage</span>
                                    <span>78%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    action: 'Task completed',
                                    description: 'Review quarterly reports',
                                    time: '2 minutes ago',
                                    icon: CheckSquare,
                                    color: 'text-green-600'
                                },
                                {
                                    action: 'Email received',
                                    description: 'Important client update',
                                    time: '5 minutes ago',
                                    icon: Mail,
                                    color: 'text-blue-600'
                                },
                                {
                                    action: 'Transaction recorded',
                                    description: 'Office supplies purchase',
                                    time: '1 hour ago',
                                    icon: DollarSign,
                                    color: 'text-purple-600'
                                },
                                {
                                    action: 'Security alert',
                                    description: 'New login detected',
                                    time: '2 hours ago',
                                    icon: Shield,
                                    color: 'text-orange-600'
                                }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className={cn('p-1 rounded-full', activity.color)}>
                                        <activity.icon className="h-3 w-3" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Text size="sm" weight="medium">{activity.action}</Text>
                                        <Text size="xs" variant="muted">{activity.description}</Text>
                                        <Text size="xs" variant="muted" className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {activity.time}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown */}
            {showDetailed && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Task Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Task Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text size="sm">Completed</Text>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${(completedTasks / Math.max(tasks.length, 1)) * 100}%` }}
                                        />
                                    </div>
                                    <Text size="sm" weight="medium">{completedTasks}</Text>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">In Progress</Text>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(inProgressTasks / Math.max(tasks.length, 1)) * 100}%` }}
                                        />
                                    </div>
                                    <Text size="sm" weight="medium">{inProgressTasks}</Text>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Pending</Text>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: `${(todoTasks / Math.max(tasks.length, 1)) * 100}%` }}
                                        />
                                    </div>
                                    <Text size="sm" weight="medium">{todoTasks}</Text>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">High Priority</Text>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <Text size="sm" weight="medium">{highPriorityTasks}</Text>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Email Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text size="sm">Total Emails</Text>
                                <Text size="sm" weight="medium">{emails.length}</Text>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Unread</Text>
                                <Text size="sm" weight="medium" className="text-blue-600">{unreadCount}</Text>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Important</Text>
                                <Text size="sm" weight="medium" className="text-orange-600">{importantEmails}</Text>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Action Required</Text>
                                <Text size="sm" weight="medium" className="text-red-600">{actionRequiredEmails}</Text>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text size="sm">Current Balance</Text>
                                <Text size="sm" weight="medium" className="text-green-600">
                                    {formatCurrency(balance)}
                                </Text>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Monthly Expenses</Text>
                                <Text size="sm" weight="medium" className="text-red-600">
                                    {formatCurrency(monthlyExpenses)}
                                </Text>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Today's Transactions</Text>
                                <Text size="sm" weight="medium">{todayTransactions}</Text>
                            </div>

                            <div className="flex items-center justify-between">
                                <Text size="sm">Total Transactions</Text>
                                <Text size="sm" weight="medium">{transactions.length}</Text>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Last Updated */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last updated: {formattedLastUpdated}</span>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live data</span>
                </div>
            </div>
        </div>
    );
}
