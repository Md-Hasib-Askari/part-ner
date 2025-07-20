// Core data types for the AI Personal Assistant

export interface User {
    id: string;
    name: string;
    email: string;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notifications: NotificationSettings;
    timezone: string;
    language: string;
    dashboardLayout: DashboardLayoutConfig;
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    desktop: boolean;
    soundEnabled: boolean;
    quietHours: {
        enabled: boolean;
        start: string;
        end: string;
    };
}

export interface DashboardLayoutConfig {
    widgets: string[];
    layout: 'grid' | 'list';
    compactMode: boolean;
}

// Task Management Types
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    attachments: Attachment[];
    subtasks: SubTask[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'personal' | 'work' | 'health' | 'finance' | 'learning' | 'other';

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
}

// Email Types
export interface EmailSummary {
    id: string;
    subject: string;
    sender: EmailContact;
    recipients: EmailContact[];
    summary: string;
    importance: 'low' | 'medium' | 'high';
    actionRequired: boolean;
    suggestedActions: string[];
    category: EmailCategory;
    receivedAt: Date;
    readAt?: Date;
}

export interface EmailContact {
    name: string;
    email: string;
}

export type EmailCategory = 'work' | 'personal' | 'finance' | 'shopping' | 'social' | 'promotions' | 'spam';

// File Organization Types
export interface FileActivity {
    id: string;
    fileName: string;
    filePath: string;
    action: FileAction;
    category: FileCategory;
    tags: string[];
    size: number;
    timestamp: Date;
    confidence: number;
}

export type FileAction = 'created' | 'modified' | 'deleted' | 'moved' | 'renamed' | 'organized';
export type FileCategory = 'documents' | 'images' | 'videos' | 'audio' | 'code' | 'archives' | 'other';

// Finance Types
export interface Transaction {
    id: string;
    amount: number;
    currency: string;
    description: string;
    category: TransactionCategory;
    type: 'income' | 'expense';
    date: Date;
    account: string;
    tags: string[];
    recurring: boolean;
}

export type TransactionCategory =
    | 'food' | 'transport' | 'entertainment' | 'utilities'
    | 'healthcare' | 'shopping' | 'education' | 'insurance'
    | 'salary' | 'investment' | 'other';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextBilling: Date;
    category: string;
    active: boolean;
    autoRenew: boolean;
}

// Network Security Types
export interface NetworkConnection {
    id: string;
    destination: string;
    port: number;
    protocol: string;
    processName: string;
    timestamp: Date;
    riskLevel: 'low' | 'medium' | 'high';
    blocked: boolean;
    description?: string;
}

export interface SecurityAlert {
    id: string;
    type: SecurityAlertType;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    timestamp: Date;
    resolved: boolean;
    actions: string[];
}

export type SecurityAlertType =
    | 'suspicious-connection' | 'malware-detected' | 'unusual-activity'
    | 'failed-login' | 'data-breach' | 'vulnerability';

// Chat/RAG Types
export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
    metadata?: {
        sources?: string[];
        confidence?: number;
        tokens?: number;
    };
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}

// Notification Types
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: 'low' | 'medium' | 'high';
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
    expiresAt?: Date;
}

export type NotificationType =
    | 'task' | 'email' | 'finance' | 'security' | 'system' | 'reminder';

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// WebSocket Types
export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: Date;
}

// Form Types
export interface TaskFormData {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    tags: string[];
}

export interface SettingsFormData {
    theme: 'light' | 'dark' | 'system';
    notifications: NotificationSettings;
    timezone: string;
    language: string;
}
