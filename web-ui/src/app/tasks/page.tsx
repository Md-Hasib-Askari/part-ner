"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { TaskList } from '@/components/organisms/task-list';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

export default function TasksPage() {
    const { setCurrentPage } = useAppStore();

    useEffect(() => {
        setCurrentPage('tasks');
    }, [setCurrentPage]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Task Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Organize, prioritize, and track your tasks efficiently.
                        </p>
                    </div>
                </div>

                <TaskList />
            </div>
        </MainLayout>
    );
}
