"use client";

import { DashboardLayout } from '@/components/templates/dashboard-layout';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { setCurrentPage } = useAppStore();

    useEffect(() => {
        setCurrentPage('dashboard');
    }, [setCurrentPage]);

    return (
        <DashboardLayout>
            {/* Additional dashboard content can be added here */}
            <div className="space-y-6">
                {/* Custom dashboard widgets could go here */}
                <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Welcome to Your AI Assistant</h3>
                    <p className="text-muted-foreground">
                        Your AI-powered personal assistant is ready to help you manage tasks, emails, finances, and more.
                        Use the navigation to explore different features, or start by creating a new task or checking your emails.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
