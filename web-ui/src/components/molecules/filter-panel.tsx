import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/atoms/buttons';
import { Text, Heading } from '@/components/atoms/typography';
import { DateInput } from '@/components/atoms/inputs';
import { ChevronDown, ChevronRight, X, RotateCcw } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
    color?: string;
}

interface FilterGroup {
    id: string;
    label: string;
    type: 'checkbox' | 'radio' | 'date-range' | 'text';
    options?: FilterOption[];
    defaultExpanded?: boolean;
    multiple?: boolean;
}

interface ActiveFilter {
    groupId: string;
    optionId: string;
    label: string;
    value?: string;
}

interface FilterPanelProps {
    groups: FilterGroup[];
    activeFilters?: ActiveFilter[];
    onFilterChange?: (filters: ActiveFilter[]) => void;
    onReset?: () => void;
    className?: string;
    collapsible?: boolean;
}

export function FilterPanel({
    groups,
    activeFilters = [],
    onFilterChange,
    onReset,
    className,
    collapsible = true,
}: FilterPanelProps) {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        new Set(groups.filter(g => g.defaultExpanded !== false).map(g => g.id))
    );

    const toggleGroup = (groupId: string) => {
        if (!collapsible) return;

        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };

    const handleFilterToggle = (groupId: string, optionId: string, label: string, value?: string) => {
        const newFilters = [...activeFilters];
        const existingIndex = newFilters.findIndex(
            f => f.groupId === groupId && f.optionId === optionId
        );

        if (existingIndex >= 0) {
            // Remove existing filter
            newFilters.splice(existingIndex, 1);
        } else {
            // Add new filter
            const group = groups.find(g => g.id === groupId);
            if (group?.type === 'radio' || !group?.multiple) {
                // Remove other filters in the same group for radio/single select
                const filteredArray = newFilters.filter(f => f.groupId !== groupId);
                filteredArray.push({ groupId, optionId, label, value });
                onFilterChange?.(filteredArray);
                return;
            }

            newFilters.push({ groupId, optionId, label, value });
        }

        onFilterChange?.(newFilters);
    };

    const removeFilter = (filterToRemove: ActiveFilter) => {
        const newFilters = activeFilters.filter(
            f => !(f.groupId === filterToRemove.groupId && f.optionId === filterToRemove.optionId)
        );
        onFilterChange?.(newFilters);
    };

    const isOptionActive = (groupId: string, optionId: string) => {
        return activeFilters.some(f => f.groupId === groupId && f.optionId === optionId);
    };

    const getActiveFiltersCount = () => activeFilters.length;

    const renderFilterGroup = (group: FilterGroup) => {
        const isExpanded = expandedGroups.has(group.id);
        const groupActiveFilters = activeFilters.filter(f => f.groupId === group.id);

        return (
            <div key={group.id} className="space-y-2">
                <div
                    className={cn(
                        'flex items-center justify-between',
                        collapsible && 'cursor-pointer'
                    )}
                    onClick={() => toggleGroup(group.id)}
                >
                    <div className="flex items-center gap-2">
                        <Heading as="h4" size="sm" weight="medium">
                            {group.label}
                        </Heading>
                        {groupActiveFilters.length > 0 && (
                            <Badge variant="secondary" className="h-5 text-xs">
                                {groupActiveFilters.length}
                            </Badge>
                        )}
                    </div>

                    {collapsible && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </div>

                {isExpanded && (
                    <div className="space-y-2 pl-2">
                        {group.type === 'checkbox' || group.type === 'radio' ? (
                            <div className="space-y-2">
                                {group.options?.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${group.id}-${option.id}`}
                                            checked={isOptionActive(group.id, option.id)}
                                            onCheckedChange={() =>
                                                handleFilterToggle(group.id, option.id, option.label)
                                            }
                                        />
                                        <Label
                                            htmlFor={`${group.id}-${option.id}`}
                                            className="flex-1 cursor-pointer flex items-center justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                {option.color && (
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: option.color }}
                                                    />
                                                )}
                                                {option.label}
                                            </span>
                                            {option.count !== undefined && (
                                                <Text size="xs" variant="muted">
                                                    {option.count}
                                                </Text>
                                            )}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        ) : group.type === 'date-range' ? (
                            <div className="space-y-2">
                                <DateInput
                                    label="From"
                                    placeholder="Start date"
                                    onChange={(e) =>
                                        handleFilterToggle(group.id, 'from', 'From', e.target.value)
                                    }
                                />
                                <DateInput
                                    label="To"
                                    placeholder="End date"
                                    onChange={(e) =>
                                        handleFilterToggle(group.id, 'to', 'To', e.target.value)
                                    }
                                />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className={cn('w-full max-w-sm', className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        Filters
                        {getActiveFiltersCount() > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </CardTitle>

                    {getActiveFiltersCount() > 0 && (
                        <IconButton
                            icon="refresh"
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            tooltip="Reset filters"
                        />
                    )}
                </div>

                {/* Active filters summary */}
                {activeFilters.length > 0 && (
                    <div className="space-y-2">
                        <Text size="xs" variant="muted">
                            Active filters:
                        </Text>
                        <div className="flex flex-wrap gap-1">
                            {activeFilters.map((filter, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="gap-1 pr-1"
                                >
                                    {filter.label}
                                    {filter.value && (
                                        <span className="text-muted-foreground">: {filter.value}</span>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                                        onClick={() => removeFilter(filter)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {groups.map((group, index) => (
                    <React.Fragment key={group.id}>
                        {renderFilterGroup(group)}
                        {index < groups.length - 1 && <Separator />}
                    </React.Fragment>
                ))}

                {/* Apply/Reset buttons for mobile or when needed */}
                {getActiveFiltersCount() > 0 && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReset}
                            className="flex-1"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Compact filter chips for mobile/header use
interface FilterChipsProps {
    activeFilters: ActiveFilter[];
    onRemoveFilter?: (filter: ActiveFilter) => void;
    onClearAll?: () => void;
    className?: string;
}

export function FilterChips({
    activeFilters,
    onRemoveFilter,
    onClearAll,
    className,
}: FilterChipsProps) {
    if (activeFilters.length === 0) return null;

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            <Text size="xs" variant="muted">
                Filters:
            </Text>

            {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                    {filter.label}
                    {filter.value && (
                        <span className="text-muted-foreground">: {filter.value}</span>
                    )}
                    {onRemoveFilter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                            onClick={() => onRemoveFilter(filter)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </Badge>
            ))}

            {activeFilters.length > 1 && onClearAll && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="h-6 px-2 text-xs"
                >
                    Clear all
                </Button>
            )}
        </div>
    );
}
