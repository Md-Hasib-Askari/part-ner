"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { ChatWindow } from '@/components/organisms/chat-window';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

export default function ChatPage() {
    const { setCurrentPage } = useAppStore();

    useEffect(() => {
        setCurrentPage('chat');
    }, [setCurrentPage]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">AI Assistant Chat</h1>
                        <p className="text-muted-foreground mt-1">
                            Chat with your AI assistant powered by RAG for intelligent responses.
                        </p>
                    </div>
                </div>

                <ChatWindow />
            </div>
        </MainLayout>
    );
}
