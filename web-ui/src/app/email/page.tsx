"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { EmailSummary } from '@/components/organisms/email-summary';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

export default function EmailPage() {
    const { setCurrentPage } = useAppStore();

    useEffect(() => {
        setCurrentPage('email');
    }, [setCurrentPage]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Email Management</h1>
                        <p className="text-muted-foreground mt-1">
                            AI-powered email summaries and intelligent categorization.
                        </p>
                    </div>
                </div>

                <EmailSummary />
            </div>
        </MainLayout>
    );
}
