import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/atoms/inputs';
import { IconButton } from '@/components/atoms/buttons';
import { Text } from '@/components/atoms/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, History, Bookmark } from 'lucide-react';

interface SearchSuggestion {
    id: string;
    text: string;
    type: 'recent' | 'suggestion' | 'saved';
    category?: string;
}

interface SearchBarProps {
    value?: string;
    placeholder?: string;
    suggestions?: SearchSuggestion[];
    recentSearches?: string[];
    savedSearches?: string[];
    showFilters?: boolean;
    activeFilters?: string[];
    onSearch?: (query: string) => void;
    onFilterToggle?: (filter: string) => void;
    onSuggestionClick?: (suggestion: SearchSuggestion) => void;
    onSaveSearch?: (query: string) => void;
    onClearFilters?: () => void;
    className?: string;
    loading?: boolean;
}

export function SearchBar({
    value = '',
    placeholder = 'Search...',
    suggestions = [],
    recentSearches = [],
    savedSearches = [],
    showFilters = false,
    activeFilters = [],
    onSearch,
    onFilterToggle,
    onSuggestionClick,
    onSaveSearch,
    onClearFilters,
    className,
    loading = false,
}: SearchBarProps) {
    const [query, setQuery] = useState(value);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Combine all suggestions
    const allSuggestions: SearchSuggestion[] = [
        ...savedSearches.map(search => ({ id: search, text: search, type: 'saved' as const })),
        ...recentSearches.map(search => ({ id: search, text: search, type: 'recent' as const })),
        ...suggestions,
    ].filter((item, index, self) =>
        index === self.findIndex(s => s.text === item.text)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setShowSuggestions(true);
        setSelectedIndex(-1);
    };

    const handleInputFocus = () => {
        setShowSuggestions(true);
    };

    const handleSearch = (searchQuery?: string) => {
        const finalQuery = searchQuery || query;
        if (finalQuery.trim()) {
            onSearch?.(finalQuery.trim());
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < allSuggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    const suggestion = allSuggestions[selectedIndex];
                    handleSuggestionClick(suggestion);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onSuggestionClick?.(suggestion);
        handleSearch(suggestion.text);
    };

    const handleClear = () => {
        setQuery('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    const getSuggestionIcon = (type: SearchSuggestion['type']) => {
        switch (type) {
            case 'saved':
                return <Bookmark className="h-4 w-4 text-primary" />;
            case 'recent':
                return <History className="h-4 w-4 text-muted-foreground" />;
            default:
                return <Search className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div ref={searchRef} className={cn('relative w-full max-w-md', className)}>
            {/* Main search input */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                        'w-full h-10 pl-10 pr-20 rounded-md border border-input bg-background text-sm',
                        'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                        'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                    disabled={loading}
                />

                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query && (
                        <IconButton
                            icon="close"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            tooltip="Clear search"
                        />
                    )}

                    {showFilters && (
                        <IconButton
                            icon="filter"
                            variant={activeFilters.length > 0 ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onFilterToggle?.('filter')}
                            tooltip="Filters"
                        />
                    )}
                </div>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                    <Text size="xs" variant="muted">
                        Filters:
                    </Text>
                    {activeFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="gap-1">
                            {filter}
                            <button
                                onClick={() => onFilterToggle?.(filter)}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="h-6 px-2 text-xs"
                    >
                        Clear all
                    </Button>
                </div>
            )}

            {/* Search suggestions dropdown */}
            {showSuggestions && allSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                    {allSuggestions.map((suggestion, index) => (
                        <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-accent',
                                'focus:bg-accent focus:outline-none',
                                selectedIndex === index && 'bg-accent'
                            )}
                        >
                            {getSuggestionIcon(suggestion.type)}

                            <div className="flex-1 min-w-0">
                                <Text size="sm" className="truncate">
                                    {suggestion.text}
                                </Text>
                                {suggestion.category && (
                                    <Text size="xs" variant="muted">
                                        in {suggestion.category}
                                    </Text>
                                )}
                            </div>

                            {suggestion.type === 'recent' && (
                                <Text size="xs" variant="muted">
                                    Recent
                                </Text>
                            )}

                            {suggestion.type === 'saved' && onSaveSearch && (
                                <IconButton
                                    icon="delete"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        // Handle remove saved search
                                    }}
                                    tooltip="Remove saved search"
                                />
                            )}
                        </button>
                    ))}

                    {/* Save search option */}
                    {query.trim() && !savedSearches.includes(query.trim()) && onSaveSearch && (
                        <div className="border-t border-border">
                            <button
                                onClick={() => onSaveSearch(query.trim())}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent"
                            >
                                <Bookmark className="h-4 w-4 text-muted-foreground" />
                                <Text size="sm">
                                    Save search "{query.trim()}"
                                </Text>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </div>
            )}
        </div>
    );
}

// Quick search variant for headers
interface QuickSearchProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export function QuickSearch({
    onSearch,
    placeholder = "Quick search...",
    className
}: QuickSearchProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn('relative', className)}>
            <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full"
            />
        </form>
    );
}
