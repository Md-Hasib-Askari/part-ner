'use client';

import React, { useState, useMemo } from 'react';
import { useTaskStore } from '@/store';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { TaskCard, TaskCardCompact } from '@/components/molecules/task-card';
import { SearchBar } from '@/components/molecules/search-bar';
import { FilterPanel } from '@/components/molecules/filter-panel';
import { StatCard } from '@/components/molecules/stat-card';
import { LoadingOverlay } from '@/components/atoms/loading';
import { ActionButton, FloatingActionButton } from '@/components/atoms/buttons';
import { Heading, Text } from '@/components/atoms/typography';
import { cn } from '@/lib/utils';
import {
    Plus,
    Filter,
    Grid3X3,
    List,
    SortAsc,
    SortDesc,
    Calendar,
    CheckCircle2,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';

interface TaskListProps {
    className?: string;
    variant?: 'full' | 'compact' | 'dashboard';
    showFilters?: boolean;
    showStats?: boolean;
    allowCreation?: boolean;
    maxItems?: number;
}

interface TaskListFilters {
    search: string;
    status: TaskStatus[];
    priority: TaskPriority[];
    assignedTo: string[];
    category: string[];
    dueDateFrom?: Date;
    dueDateTo?: Date;
    tags: string[];
}

type SortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export function TaskList({
    className,
    variant = 'full',
    showFilters = true,
    showStats = true,
    allowCreation = true,
    maxItems
}: TaskListProps) {
    const {
        tasks,
        addTask,
        updateTask,
        deleteTask
    } = useTaskStore();

    const [filters, setFilters] = useState<TaskListFilters>({
        search: '',
        status: [],
        priority: [],
        assignedTo: [],
        category: [],
        tags: []
    });

    const [sortField, setSortField] = useState<SortField>('dueDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);

    // Filter and sort tasks
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            // Search filter
            if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
                !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(task.status)) {
                return false;
            }

            // Priority filter
            if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
                return false;
            }

            // Assigned to filter
            // Note: assignedTo is not in the Task type, so this filter is disabled
            // if (filters.assignedTo.length > 0 &&
            //     (!task.assignedTo || !filters.assignedTo.includes(task.assignedTo))) {
            //     return false;
            // }

            // Category filter
            if (filters.category.length > 0 &&
                (!task.category || !filters.category.includes(task.category))) {
                return false;
            }

            // Due date filter
            if (filters.dueDateFrom && task.dueDate &&
                new Date(task.dueDate) < filters.dueDateFrom) {
                return false;
            }

            if (filters.dueDateTo && task.dueDate &&
                new Date(task.dueDate) > filters.dueDateTo) {
                return false;
            }

            // Tags filter
            if (filters.tags.length > 0 &&
                (!task.tags || !filters.tags.some(tag => task.tags.includes(tag)))) {
                return false;
            }

            return true;
        });

        // Sort tasks
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'priority':
                    const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
                    aValue = priorityOrder[a.priority];
                    bValue = priorityOrder[b.priority];
                    break;
                case 'dueDate':
                    aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                    bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case 'updatedAt':
                    aValue = new Date(a.updatedAt).getTime();
                    bValue = new Date(b.updatedAt).getTime();
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Apply max items limit
        if (maxItems) {
            filtered = filtered.slice(0, maxItems);
        }

        return filtered;
    }, [tasks, filters, sortField, sortOrder, maxItems]);

    // Task statistics
    const taskStats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const overdue = tasks.filter(t =>
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length;
        const urgent = tasks.filter(t => t.priority === 'urgent').length;

        return { total, completed, inProgress, overdue, urgent };
    }, [tasks]);

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
    };

    const handleFilterChange = (newFilters: Partial<TaskListFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleCreateTask = async () => {
        const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
            title: 'New Task',
            description: '',
            status: 'todo',
            priority: 'medium',
            dueDate: undefined,
            category: 'personal',
            tags: [],
            subtasks: [],
            attachments: []
        };

        try {
            addTask({
                ...newTask,
                id: `task-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date()
            } as Task);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const activeFiltersCount = useMemo(() => {
        return (
            (filters.search ? 1 : 0) +
            filters.status.length +
            filters.priority.length +
            filters.assignedTo.length +
            filters.category.length +
            filters.tags.length +
            (filters.dueDateFrom ? 1 : 0) +
            (filters.dueDateTo ? 1 : 0)
        );
    }, [filters]);

    const TaskCardComponent = variant === 'compact' ? TaskCardCompact : TaskCard;

    return (
        <div className={cn('space-y-6', className)}>
            {/* Header */}
            {variant === 'full' && (
                <div className="flex items-center justify-between">
                    <div>
                        <Heading as="h1" className="text-2xl font-bold">
                            Tasks
                        </Heading>
                        <Text variant="muted" className="mt-1">
                            Manage your tasks and stay organized
                        </Text>
                    </div>
                    {allowCreation && (
                        <ActionButton
                            variant="default"
                            icon="add"
                            label="New Task"
                            onClick={handleCreateTask}
                        />
                    )}
                </div>
            )}

            {/* Statistics */}
            {showStats && variant !== 'compact' && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Tasks"
                        value={taskStats.total}
                        icon={List}
                        variant="default"
                    />
                    <StatCard
                        title="Completed"
                        value={taskStats.completed}
                        icon={CheckCircle2}
                        variant="success"
                    />
                    <StatCard
                        title="In Progress"
                        value={taskStats.inProgress}
                        icon={Clock}
                        variant="info"
                    />
                    <StatCard
                        title="Overdue"
                        value={taskStats.overdue}
                        icon={AlertTriangle}
                        variant="warning"
                    />
                    <StatCard
                        title="Urgent"
                        value={taskStats.urgent}
                        icon={AlertTriangle}
                        variant="destructive"
                    />
                </div>
            )}

            {/* Search and Controls */}
            {variant !== 'compact' && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Search tasks..."
                            value={filters.search}
                            onSearch={handleSearch}
                            suggestions={[]}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Sort */}
                        <div className="flex items-center border rounded-lg">
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                icon={sortOrder === 'asc' ? 'sortAsc' : 'sortDesc'}
                                label="Sort"
                                onClick={() => handleSort(sortField)}
                                className="border-0 rounded-r-none"
                            />
                            <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value as SortField)}
                                className="border-0 border-l bg-background px-3 py-2 text-sm rounded-l-none focus:outline-none"
                            >
                                <option value="dueDate">Due Date</option>
                                <option value="title">Title</option>
                                <option value="priority">Priority</option>
                                <option value="createdAt">Created</option>
                                <option value="updatedAt">Updated</option>
                            </select>
                        </div>

                        {/* View Mode */}
                        <div className="flex items-center border rounded-lg">
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="border-0 rounded-r-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="border-0 rounded-l-none"
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <ActionButton
                                variant={showFiltersPanel ? 'default' : 'outline'}
                                size="sm"
                                icon="filter"
                                label="Filters"
                                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                                className="relative"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Filter Panel */}
            {showFiltersPanel && showFilters && (
                <FilterPanel
                    groups={[
                        {
                            id: 'status',
                            label: 'Status',
                            type: 'checkbox',
                            options: [
                                { id: 'todo', label: 'To Do' },
                                { id: 'in-progress', label: 'In Progress' },
                                { id: 'completed', label: 'Completed' },
                                { id: 'cancelled', label: 'Cancelled' }
                            ],
                            defaultExpanded: true
                        },
                        {
                            id: 'priority',
                            label: 'Priority',
                            type: 'checkbox',
                            options: [
                                { id: 'low', label: 'Low' },
                                { id: 'medium', label: 'Medium' },
                                { id: 'high', label: 'High' },
                                { id: 'urgent', label: 'Urgent' }
                            ],
                            defaultExpanded: true
                        }
                    ]}
                    activeFilters={[
                        ...filters.status.map(status => ({
                            groupId: 'status',
                            optionId: status,
                            label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
                        })),
                        ...filters.priority.map(priority => ({
                            groupId: 'priority',
                            optionId: priority,
                            label: priority.charAt(0).toUpperCase() + priority.slice(1)
                        }))
                    ]}
                    onFilterChange={(activeFilters) => {
                        const newFilters = { ...filters };

                        // Reset status and priority
                        newFilters.status = [];
                        newFilters.priority = [];

                        // Apply active filters
                        activeFilters.forEach(filter => {
                            if (filter.groupId === 'status') {
                                newFilters.status.push(filter.optionId as TaskStatus);
                            } else if (filter.groupId === 'priority') {
                                newFilters.priority.push(filter.optionId as TaskPriority);
                            }
                        });

                        setFilters(newFilters);
                    }}
                    onReset={() => {
                        setFilters({
                            search: '',
                            status: [],
                            priority: [],
                            assignedTo: [],
                            category: [],
                            tags: []
                        });
                    }}
                />
            )}

            {/* Task List */}
            <div className="space-y-4">
                {filteredAndSortedTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <Heading as="h3" className="text-lg font-medium mb-2">
                            No tasks found
                        </Heading>
                        <Text variant="muted">
                            {tasks.length === 0
                                ? "Get started by creating your first task"
                                : "Try adjusting your search or filters"
                            }
                        </Text>
                        {allowCreation && tasks.length === 0 && (
                            <ActionButton
                                variant="outline"
                                icon="add"
                                label="Create Task"
                                onClick={handleCreateTask}
                                className="mt-4"
                            />
                        )}
                    </div>
                ) : (
                    <div className={cn(
                        'gap-4',
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                            : 'space-y-3'
                    )}>
                        {filteredAndSortedTasks.map((task) => (
                            <TaskCardComponent
                                key={task.id}
                                task={task}
                                onToggleComplete={() => updateTask(task.id, {
                                    ...task,
                                    status: task.status === 'completed' ? 'todo' : 'completed'
                                })}
                                onEdit={(updates) => updateTask(task.id, { ...task, ...updates })}
                                onDelete={() => deleteTask(task.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Load More (for dashboard variant) */}
            {variant === 'dashboard' && maxItems && filteredAndSortedTasks.length >= maxItems && (
                <div className="text-center">
                    <ActionButton
                        variant="outline"
                        icon="tasks"
                        label="View All Tasks"
                        onClick={() => {/* Navigate to full task list */ }}
                    />
                </div>
            )}

            {/* Floating Action Button (mobile) */}
            {allowCreation && variant === 'full' && (
                <FloatingActionButton
                    icon="add"
                    onClick={handleCreateTask}
                    className="sm:hidden"
                />
            )}
        </div>
    );
}

export default TaskList;
