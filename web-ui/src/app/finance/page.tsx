"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { useAppStore, useFinanceStore } from '@/store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/molecules/stat-card';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    PiggyBank,
    Receipt,
    Target,
    Plus,
    Filter,
    Download
} from 'lucide-react';

export default function FinancePage() {
    const { setCurrentPage } = useAppStore();
    const { transactions, monthlyBudget, monthlySpent } = useFinanceStore();

    useEffect(() => {
        setCurrentPage('finance');
    }, [setCurrentPage]);

    // Calculate financial metrics
    const thisMonthExpenses = transactions
        .filter(t => t.type === 'expense' && isThisMonth(new Date(t.date)))
        .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthIncome = transactions
        .filter(t => t.type === 'income' && isThisMonth(new Date(t.date)))
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = monthlyBudget;
    const budgetUsed = totalBudget > 0 ? (thisMonthExpenses / totalBudget) * 100 : 0;

    function isThisMonth(date: Date): boolean {
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Finance Tracker</h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor expenses, track budgets, and gain insights into your financial health.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Monthly Income"
                        value={`$${thisMonthIncome.toFixed(2)}`}
                        description="This month"
                        trend={{ value: 8, label: "+8%", isPositive: true }}
                        variant="success"
                        icon={TrendingUp}
                    />

                    <StatCard
                        title="Monthly Expenses"
                        value={`$${thisMonthExpenses.toFixed(2)}`}
                        description="This month"
                        trend={{ value: -3, label: "-3%", isPositive: true }}
                        variant="default"
                        icon={TrendingDown}
                    />

                    <StatCard
                        title="Budget Usage"
                        value={`${budgetUsed.toFixed(1)}%`}
                        description="of total budget"
                        trend={{ value: 5, label: "+5%", isPositive: false }}
                        variant={budgetUsed > 80 ? "destructive" : "warning"}
                        icon={Target}
                    />

                    <StatCard
                        title="Net Savings"
                        value={`$${(thisMonthIncome - thisMonthExpenses).toFixed(2)}`}
                        description="This month"
                        trend={{ value: 12, label: "+12%", isPositive: true }}
                        variant="info"
                        icon={PiggyBank}
                    />
                </div>

                {/* Budget Overview and Recent Transactions */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Budget Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Monthly Budget</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${monthlySpent.toFixed(2)} / ${monthlyBudget.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${budgetUsed > 90 ? 'bg-red-500' :
                                                    budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Category breakdown placeholder */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Food & Dining</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${(monthlySpent * 0.4).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '40%' }} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Transportation</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${(monthlySpent * 0.25).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '25%' }} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Entertainment</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${(monthlySpent * 0.15).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '15%' }} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Recent Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.slice(0, 5).map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {transaction.type === 'income' ?
                                                    <TrendingUp className="h-4 w-4" /> :
                                                    <TrendingDown className="h-4 w-4" />
                                                }
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{transaction.description}</p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Financial Insights */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Top Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Food & Dining</span>
                                    <span className="text-sm font-medium">$542.30</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Transportation</span>
                                    <span className="text-sm font-medium">$298.45</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Entertainment</span>
                                    <span className="text-sm font-medium">$186.20</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PiggyBank className="h-5 w-5" />
                                Savings Goal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Emergency Fund</span>
                                    <span className="text-sm font-medium">78%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '78%' }} />
                                </div>
                                <p className="text-xs text-muted-foreground">$7,800 of $10,000</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Monthly Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Average Monthly</span>
                                    <span className="text-sm font-medium">$2,340</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600">12% decrease vs last month</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coming Soon Notice */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Advanced Financial Analytics Coming Soon</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Enhanced features including investment tracking, bill reminders, financial forecasting,
                                and detailed spending analytics will be available in upcoming updates.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
