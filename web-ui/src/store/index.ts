import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
    User,
    Task,
    EmailSummary,
    Transaction,
    Notification,
    ChatSession,
    NetworkConnection,
    FileActivity
} from '@/types';

// Main Application Store
interface AppState {
    // User & Authentication
    user: User | null;
    isAuthenticated: boolean;

    // UI State
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    currentPage: string;
    loading: boolean;
    error: string | null;

    // System State
    systemHealth: number;
    lastUpdated: Date | null;

    // Actions
    setUser: (user: User | null) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setCurrentPage: (page: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSystemHealth: (health: number) => void;
    setLastUpdated: (date: Date) => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                user: null,
                isAuthenticated: false,
                theme: 'system',
                sidebarCollapsed: false,
                currentPage: 'dashboard',
                loading: false,
                error: null,
                systemHealth: 85,
                lastUpdated: new Date(),

                // Actions
                setUser: (user) => set({ user }),
                setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
                setTheme: (theme) => set({ theme }),
                setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
                setCurrentPage: (currentPage) => set({ currentPage }),
                setLoading: (loading) => set({ loading }),
                setError: (error) => set({ error }),
                setSystemHealth: (systemHealth) => set({ systemHealth }),
                setLastUpdated: (lastUpdated) => set({ lastUpdated }),
            }),
            {
                name: 'app-store',
                partialize: (state) => ({
                    theme: state.theme,
                    sidebarCollapsed: state.sidebarCollapsed,
                }),
            }
        )
    )
);

// Task Management Store
interface TaskState {
    tasks: Task[];
    selectedTask: Task | null;
    filter: {
        status: string;
        priority: string;
        category: string;
        search: string;
    };

    // Actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    setSelectedTask: (task: Task | null) => void;
    setFilter: (filter: Partial<TaskState['filter']>) => void;
    getTasks: () => Task[];
    getTasksByStatus: (status: string) => Task[];
    getTasksByPriority: (priority: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
    devtools((set, get) => ({
        tasks: [],
        selectedTask: null,
        filter: {
            status: 'all',
            priority: 'all',
            category: 'all',
            search: '',
        },

        setTasks: (tasks) => set({ tasks }),
        addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
        updateTask: (id, updates) =>
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, ...updates } : task
                ),
            })),
        deleteTask: (id) =>
            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id),
            })),
        setSelectedTask: (selectedTask) => set({ selectedTask }),
        setFilter: (filter) =>
            set((state) => ({ filter: { ...state.filter, ...filter } })),
        getTasks: () => get().tasks,
        getTasksByStatus: (status) =>
            get().tasks.filter((task) => status === 'all' || task.status === status),
        getTasksByPriority: (priority) =>
            get().tasks.filter((task) => priority === 'all' || task.priority === priority),
    }))
);

// Email Store
interface EmailState {
    emails: EmailSummary[];
    selectedEmail: EmailSummary | null;
    unreadCount: number;
    filter: {
        category: string;
        importance: string;
        search: string;
    };

    // Actions
    setEmails: (emails: EmailSummary[]) => void;
    addEmail: (email: EmailSummary) => void;
    markAsRead: (id: string) => void;
    setSelectedEmail: (email: EmailSummary | null) => void;
    setFilter: (filter: Partial<EmailState['filter']>) => void;
    getUnreadEmails: () => EmailSummary[];
}

export const useEmailStore = create<EmailState>()(
    devtools((set, get) => ({
        emails: [],
        selectedEmail: null,
        unreadCount: 0,
        filter: {
            category: 'all',
            importance: 'all',
            search: '',
        },

        setEmails: (emails) =>
            set({
                emails,
                unreadCount: emails.filter((email) => !email.readAt).length
            }),
        addEmail: (email) =>
            set((state) => ({
                emails: [email, ...state.emails],
                unreadCount: !email.readAt ? state.unreadCount + 1 : state.unreadCount,
            })),
        markAsRead: (id) =>
            set((state) => ({
                emails: state.emails.map((email) =>
                    email.id === id ? { ...email, readAt: new Date() } : email
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            })),
        setSelectedEmail: (selectedEmail) => set({ selectedEmail }),
        setFilter: (filter) =>
            set((state) => ({ filter: { ...state.filter, ...filter } })),
        getUnreadEmails: () =>
            get().emails.filter((email) => !email.readAt),
    }))
);

// Finance Store
interface FinanceState {
    transactions: Transaction[];
    balance: number;
    monthlyBudget: number;
    monthlySpent: number;

    // Actions
    setTransactions: (transactions: Transaction[]) => void;
    addTransaction: (transaction: Transaction) => void;
    updateBalance: (balance: number) => void;
    setMonthlyBudget: (budget: number) => void;
    calculateMonthlySpent: () => void;
}

export const useFinanceStore = create<FinanceState>()(
    devtools((set, get) => ({
        transactions: [],
        balance: 0,
        monthlyBudget: 0,
        monthlySpent: 0,

        setTransactions: (transactions) => set({ transactions }),
        addTransaction: (transaction) =>
            set((state) => ({ transactions: [transaction, ...state.transactions] })),
        updateBalance: (balance) => set({ balance }),
        setMonthlyBudget: (monthlyBudget) => set({ monthlyBudget }),
        calculateMonthlySpent: () => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlySpent = get().transactions
                .filter((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    return (
                        transaction.type === 'expense' &&
                        transactionDate.getMonth() === currentMonth &&
                        transactionDate.getFullYear() === currentYear
                    );
                })
                .reduce((total, transaction) => total + transaction.amount, 0);

            set({ monthlySpent });
        },
    }))
);

// Notification Store
interface NotificationState {
    notifications: Notification[];
    unreadCount: number;

    // Actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    devtools((set, get) => ({
        notifications: [],
        unreadCount: 0,

        setNotifications: (notifications) =>
            set({
                notifications,
                unreadCount: notifications.filter((n) => !n.read).length
            }),
        addNotification: (notification) =>
            set((state) => ({
                notifications: [notification, ...state.notifications],
                unreadCount: !notification.read ? state.unreadCount + 1 : state.unreadCount,
            })),
        markAsRead: (id) =>
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            })),
        markAllAsRead: () =>
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true })),
                unreadCount: 0,
            })),
        removeNotification: (id) =>
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: state.notifications.find((n) => n.id === id && !n.read)
                    ? state.unreadCount - 1
                    : state.unreadCount,
            })),
        clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }))
);

// Chat Store
interface ChatState {
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    isTyping: boolean;

    // Actions
    setSessions: (sessions: ChatSession[]) => void;
    setCurrentSession: (session: ChatSession | null) => void;
    addMessage: (sessionId: string, message: any) => void;
    createSession: (title: string) => void;
    setIsTyping: (isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>()(
    devtools((set, get) => ({
        sessions: [],
        currentSession: null,
        isTyping: false,

        setSessions: (sessions) => set({ sessions }),
        setCurrentSession: (currentSession) => set({ currentSession }),
        addMessage: (sessionId, message) =>
            set((state) => ({
                sessions: state.sessions.map((session) =>
                    session.id === sessionId
                        ? { ...session, messages: [...session.messages, message] }
                        : session
                ),
                currentSession: state.currentSession?.id === sessionId
                    ? { ...state.currentSession, messages: [...state.currentSession.messages, message] }
                    : state.currentSession,
            })),
        createSession: (title) => {
            const newSession: ChatSession = {
                id: Date.now().toString(),
                title,
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                archived: false,
            };
            set((state) => ({
                sessions: [newSession, ...state.sessions],
                currentSession: newSession,
            }));
        },
        setIsTyping: (isTyping) => set({ isTyping }),
    }))
);
