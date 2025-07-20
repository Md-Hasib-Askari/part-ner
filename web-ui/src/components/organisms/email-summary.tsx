import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/atoms/avatars';
import { ActionButton, IconButton } from '@/components/atoms/buttons';
import { Text, Heading } from '@/components/atoms/typography';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import { useEmailStore } from '@/store';
import { EmailSummary as EmailSummaryType } from '@/types';
import {
    Mail,
    Star,
    Archive,
    Trash2,
    Reply,
    ReplyAll,
    Forward,
    MoreHorizontal,
    AlertTriangle,
    Clock,
    Filter,
    Search,
    RefreshCw
} from 'lucide-react';

interface EmailSummaryProps {
    emails?: EmailSummaryType[];
    loading?: boolean;
    onEmailSelect?: (email: EmailSummaryType) => void;
    onRefresh?: () => void;
    className?: string;
}

export function EmailSummary({
    emails: propEmails,
    loading = false,
    onEmailSelect,
    onRefresh,
    className
}: EmailSummaryProps) {
    const { emails: storeEmails, markAsRead, selectedEmail, setSelectedEmail } = useEmailStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const emails = propEmails || storeEmails;

    const filteredEmails = emails.filter(email => {
        const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || email.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEmailClick = (email: EmailSummaryType) => {
        if (!email.readAt) {
            markAsRead(email.id);
        }
        setSelectedEmail(email);
        onEmailSelect?.(email);
    };

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            work: 'bg-blue-100 text-blue-700',
            personal: 'bg-purple-100 text-purple-700',
            finance: 'bg-green-100 text-green-700',
            shopping: 'bg-orange-100 text-orange-700',
            social: 'bg-pink-100 text-pink-700',
            promotions: 'bg-indigo-100 text-indigo-700',
            spam: 'bg-red-100 text-red-700'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <Heading as="h2" size="lg">Email Summary</Heading>
                </div>
                <div className="flex items-center gap-2">
                    <IconButton icon="refresh" onClick={onRefresh} tooltip="Refresh emails" />
                    <IconButton icon="filter" tooltip="Filter options" />
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">All Categories</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="finance">Finance</option>
                    <option value="shopping">Shopping</option>
                    <option value="social">Social</option>
                    <option value="promotions">Promotions</option>
                </select>
            </div>

            {/* Email List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 bg-gray-200 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                            <div className="h-3 bg-gray-200 rounded w-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredEmails.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <Text variant="muted">No emails found</Text>
                        </CardContent>
                    </Card>
                ) : (
                    filteredEmails.map((email) => (
                        <Card
                            key={email.id}
                            className={cn(
                                'cursor-pointer transition-colors hover:bg-muted/50',
                                !email.readAt && 'border-l-4 border-l-primary bg-primary/5',
                                selectedEmail?.id === email.id && 'ring-2 ring-primary'
                            )}
                            onClick={() => handleEmailClick(email)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <UserAvatar
                                        name={email.sender.name}
                                        size="md"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Text weight="medium" className="truncate">
                                                    {email.sender.name}
                                                </Text>
                                                <Badge
                                                    variant="outline"
                                                    className={cn('text-xs', getCategoryColor(email.category))}
                                                >
                                                    {email.category}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {email.importance === 'high' && (
                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                )}
                                                <Text size="xs" variant="muted">
                                                    {formatRelativeTime(email.receivedAt)}
                                                </Text>
                                            </div>
                                        </div>

                                        <Text
                                            weight={!email.readAt ? 'semibold' : 'normal'}
                                            className="mb-2"
                                        >
                                            {truncateText(email.subject, 60)}
                                        </Text>

                                        <Text size="sm" variant="muted" className="mb-3">
                                            {truncateText(email.summary, 120)}
                                        </Text>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={cn('text-xs', getImportanceColor(email.importance))}>
                                                    {email.importance}
                                                </Badge>
                                                {email.actionRequired && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Action Required
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconButton icon="external" size="sm" tooltip="Reply" />
                                                <IconButton icon="arrowRight" size="sm" tooltip="Forward" />
                                                <IconButton icon="delete" size="sm" tooltip="Delete" />
                                                <IconButton icon="more" size="sm" tooltip="More actions" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Email Details Panel */}
            {selectedEmail && (
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserAvatar name={selectedEmail.sender.name} size="lg" />
                                <div>
                                    <CardTitle>{selectedEmail.subject}</CardTitle>
                                    <Text size="sm" variant="muted">
                                        From: {selectedEmail.sender.name} &lt;{selectedEmail.sender.email}&gt;
                                    </Text>
                                    <Text size="sm" variant="muted">
                                        {formatRelativeTime(selectedEmail.receivedAt)}
                                    </Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ActionButton icon="external" label="Reply" size="sm" />
                                <ActionButton icon="arrowRight" label="Forward" size="sm" variant="outline" />
                                <IconButton icon="more" tooltip="More actions" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <Text weight="medium" className="mb-2">Summary:</Text>
                            <Text>{selectedEmail.summary}</Text>
                        </div>

                        {selectedEmail.suggestedActions.length > 0 && (
                            <div>
                                <Text weight="medium" className="mb-2">Suggested Actions:</Text>
                                <div className="space-y-1">
                                    {selectedEmail.suggestedActions.map((action, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                                            <Text size="sm">{action}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Text size="sm" variant="muted">Category:</Text>
                                    <Badge className={getCategoryColor(selectedEmail.category)}>
                                        {selectedEmail.category}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Text size="sm" variant="muted">Importance:</Text>
                                    <Badge className={getImportanceColor(selectedEmail.importance)}>
                                        {selectedEmail.importance}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
