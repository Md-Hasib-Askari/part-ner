import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/atoms/avatars';
import { IconButton } from '@/components/atoms/buttons';
import { Text, Heading } from '@/components/atoms/typography';
import { DotsLoading } from '@/components/atoms/loading';
import { formatRelativeTime } from '@/lib/utils';
import { useChatStore } from '@/store';
import { ChatMessage, ChatSession } from '@/types';
import {
    MessageCircle,
    Send,
    Paperclip,
    Mic,
    MicOff,
    MoreHorizontal,
    Plus,
    History,
    Settings,
    Download,
    Copy,
    RefreshCw
} from 'lucide-react';

interface ChatWindowProps {
    session?: ChatSession;
    onSendMessage?: (message: string, sessionId?: string) => void;
    onNewSession?: () => void;
    className?: string;
}

export function ChatWindow({
    session: propSession,
    onSendMessage,
    onNewSession,
    className
}: ChatWindowProps) {
    const {
        currentSession,
        sessions,
        isTyping,
        addMessage,
        createSession,
        setCurrentSession,
        setIsTyping
    } = useChatStore();

    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showSessions, setShowSessions] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activeSession = propSession || currentSession;

    useEffect(() => {
        scrollToBottom();
    }, [activeSession?.messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message.trim(),
            role: 'user',
            timestamp: new Date(),
        };

        if (activeSession) {
            addMessage(activeSession.id, newMessage);
        }

        onSendMessage?.(message.trim(), activeSession?.id);
        setMessage('');

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const aiResponse: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    content: "I understand your request. Let me help you with that...",
                    role: 'assistant',
                    timestamp: new Date(),
                    metadata: {
                        sources: ['Knowledge Base', 'Recent Tasks'],
                        confidence: 0.85,
                        tokens: 156
                    }
                };

                if (activeSession) {
                    addMessage(activeSession.id, aiResponse);
                }
                setIsTyping(false);
            }, 2000);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewSession = () => {
        createSession('New Conversation');
        onNewSession?.();
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // Voice recording implementation would go here
    };

    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const getMessageIcon = (role: string) => {
        switch (role) {
            case 'user':
                return <UserAvatar name="You" size="sm" />;
            case 'assistant':
                return (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-primary-foreground" />
                    </div>
                );
            case 'system':
                return (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <Heading as="h2" size="lg">
                        {activeSession?.title || 'AI Assistant'}
                    </Heading>
                </div>
                <div className="flex items-center gap-2">
                    <IconButton
                        icon="add"
                        onClick={handleNewSession}
                        tooltip="New conversation"
                    />
                    <IconButton
                        icon="refresh"
                        tooltip="Refresh"
                    />
                    <IconButton
                        icon="more"
                        onClick={() => setShowSessions(!showSessions)}
                        tooltip="Chat history"
                    />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Chat History Sidebar */}
                {showSessions && (
                    <div className="w-64 border-r bg-muted/30 p-4">
                        <div className="space-y-2">
                            <Text weight="medium" size="sm">Recent Conversations</Text>
                            <Separator />
                            <div className="space-y-1">
                                {sessions.map((session) => (
                                    <Button
                                        key={session.id}
                                        variant={session.id === activeSession?.id ? "default" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => setCurrentSession(session)}
                                    >
                                        <Text size="sm" className="truncate">
                                            {session.title}
                                        </Text>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {!activeSession ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <MessageCircle className="h-12 w-12 mb-4 text-muted-foreground" />
                                <Heading as="h3" size="lg" className="mb-2">
                                    Welcome to AI Assistant
                                </Heading>
                                <Text variant="muted" className="mb-4">
                                    Start a conversation to get help with your tasks, questions, and more.
                                </Text>
                                <Button onClick={handleNewSession}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Start New Conversation
                                </Button>
                            </div>
                        ) : (
                            <>
                                {activeSession.messages.map((msg) => (
                                    <div key={msg.id} className="flex gap-3 group">
                                        {getMessageIcon(msg.role)}

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Text size="sm" weight="medium">
                                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                                </Text>
                                                <Text size="xs" variant="muted">
                                                    {formatRelativeTime(msg.timestamp)}
                                                </Text>
                                            </div>

                                            <Card className={cn(
                                                'p-3',
                                                msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground ml-8'
                                                    : 'bg-muted'
                                            )}>
                                                <Text className={msg.role === 'user' ? 'text-primary-foreground' : ''}>
                                                    {msg.content}
                                                </Text>

                                                {msg.metadata && (
                                                    <div className="mt-2 pt-2 border-t border-border/20">
                                                        <div className="flex items-center gap-4 text-xs opacity-70">
                                                            {msg.metadata.sources && (
                                                                <span>Sources: {msg.metadata.sources.join(', ')}</span>
                                                            )}
                                                            {msg.metadata.confidence && (
                                                                <span>Confidence: {(msg.metadata.confidence * 100).toFixed(0)}%</span>
                                                            )}
                                                            {msg.metadata.tokens && (
                                                                <span>Tokens: {msg.metadata.tokens}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconButton
                                                    icon="copy"
                                                    size="sm"
                                                    onClick={() => copyMessage(msg.content)}
                                                    tooltip="Copy message"
                                                />
                                                <IconButton
                                                    icon="download"
                                                    size="sm"
                                                    tooltip="Save message"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                            <MessageCircle className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                        <Card className="p-3 bg-muted">
                                            <DotsLoading />
                                        </Card>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    {activeSession && (
                        <div className="p-4 border-t bg-background">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Textarea
                                        ref={textareaRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                                        className="min-h-[60px] max-h-[120px] resize-none pr-12"
                                    />
                                    <div className="absolute bottom-2 right-2 flex gap-1">
                                        <IconButton
                                            icon="paperclip"
                                            size="sm"
                                            tooltip="Attach file"
                                        />
                                        <IconButton
                                            icon={isRecording ? "micOff" : "mic"}
                                            size="sm"
                                            onClick={toggleRecording}
                                            className={isRecording ? "text-red-500" : ""}
                                            tooltip={isRecording ? "Stop recording" : "Voice input"}
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    size="lg"
                                    className="px-6"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <Text size="xs" variant="muted">
                                    AI Assistant can make mistakes. Please verify important information.
                                </Text>
                                <Text size="xs" variant="muted">
                                    {message.length}/2000 characters
                                </Text>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
