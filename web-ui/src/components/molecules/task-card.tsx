import React from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/atoms/badges';
import { IconButton } from '@/components/atoms/buttons';
import { Text, Heading } from '@/components/atoms/typography';
import { UserAvatar } from '@/components/atoms/avatars';
import { Task } from '@/types';

interface TaskCardProps {
    task: Task;
    onToggleComplete?: (taskId: string, completed: boolean) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (taskId: string) => void;
    onAssign?: (taskId: string) => void;
    className?: string;
    compact?: boolean;
    showAssignee?: boolean;
}

export function TaskCard({
    task,
    onToggleComplete,
    onEdit,
    onDelete,
    onAssign,
    className,
    compact = false,
    showAssignee = true,
}: TaskCardProps) {
    const isCompleted = task.status === 'completed';
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

    const handleToggleComplete = () => {
        onToggleComplete?.(task.id, !isCompleted);
    };

    return (
        <Card
            className={cn(
                'transition-all duration-200 hover:shadow-md',
                isCompleted && 'opacity-75',
                isOverdue && 'border-destructive/50 bg-destructive/5',
                className
            )}
        >
            <CardHeader className={cn('pb-2', compact && 'pb-1')}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                            checked={isCompleted}
                            onCheckedChange={handleToggleComplete}
                            className="mt-1"
                        />

                        <div className="flex-1 min-w-0">
                            <Heading
                                as="h3"
                                size="sm"
                                className={cn(
                                    'leading-tight',
                                    isCompleted && 'line-through text-muted-foreground'
                                )}
                            >
                                {task.title}
                            </Heading>

                            {!compact && task.description && (
                                <Text
                                    size="sm"
                                    variant="muted"
                                    className="mt-1 line-clamp-2"
                                >
                                    {task.description}
                                </Text>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {onEdit && (
                            <IconButton
                                icon="edit"
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(task)}
                                tooltip="Edit task"
                            />
                        )}
                        {onDelete && (
                            <IconButton
                                icon="delete"
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(task.id)}
                                tooltip="Delete task"
                            />
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className={cn('pt-0', compact && 'pb-3')}>
                <div className="space-y-3">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        <CategoryBadge category={task.category} />

                        {task.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Subtasks Progress */}
                    {!compact && task.subtasks.length > 0 && (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Text size="sm" variant="muted">
                                    Subtasks
                                </Text>
                                <Text size="sm" variant="muted">
                                    {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length}
                                </Text>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            {task.dueDate && (
                                <div className="flex items-center gap-1">
                                    <Text
                                        size="xs"
                                        variant={isOverdue ? "destructive" : "muted"}
                                        className="font-medium"
                                    >
                                        {isOverdue ? 'Overdue' : 'Due'} {formatRelativeTime(task.dueDate)}
                                    </Text>
                                </div>
                            )}

                            {task.attachments.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <IconButton
                                        icon="files"
                                        variant="ghost"
                                        size="sm"
                                        tooltip={`${task.attachments.length} attachments`}
                                    />
                                    <Text size="xs" variant="muted">
                                        {task.attachments.length}
                                    </Text>
                                </div>
                            )}
                        </div>

                        {showAssignee && (
                            <div className="flex items-center gap-2">
                                <UserAvatar
                                    name="Current User"
                                    size="xs"
                                />
                                {onAssign && (
                                    <IconButton
                                        icon="add"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAssign(task.id)}
                                        tooltip="Assign task"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Created/Updated timestamp */}
                    {!compact && (
                        <Text size="xs" variant="muted">
                            Created {formatRelativeTime(task.createdAt)}
                            {task.updatedAt !== task.createdAt && (
                                <> • Updated {formatRelativeTime(task.updatedAt)}</>
                            )}
                        </Text>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Compact version for lists
export function TaskCardCompact(props: TaskCardProps) {
    return <TaskCard {...props} compact={true} />;
}

// Task card skeleton for loading states
export function TaskCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn('animate-pulse', className)}>
            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                    <div className="flex gap-1">
                        <div className="h-6 w-6 bg-muted rounded" />
                        <div className="h-6 w-6 bg-muted rounded" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded-full" />
                        <div className="h-5 w-12 bg-muted rounded-full" />
                        <div className="h-5 w-20 bg-muted rounded-full" />
                    </div>
                    <div className="flex justify-between">
                        <div className="h-3 w-24 bg-muted rounded" />
                        <div className="h-6 w-6 bg-muted rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
