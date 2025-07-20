"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FolderOpen,
    FileText,
    Image,
    Video,
    Music,
    Archive,
    Upload,
    Search,
    Filter
} from 'lucide-react';

export default function FilesPage() {
    const { setCurrentPage } = useAppStore();

    useEffect(() => {
        setCurrentPage('files');
    }, [setCurrentPage]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">File Organizer</h1>
                        <p className="text-muted-foreground mt-1">
                            AI-powered file organization with automatic tagging and smart categorization.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Search className="h-4 w-4" />
                            Search Files
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Files
                        </Button>
                    </div>
                </div>

                {/* File Organization Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Documents</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">147</div>
                            <p className="text-xs text-muted-foreground">+12% from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Images</CardTitle>
                            <Image className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">89</div>
                            <p className="text-xs text-muted-foreground">+5% from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Videos</CardTitle>
                            <Video className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">23</div>
                            <p className="text-xs text-muted-foreground">+3% from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.4GB</div>
                            <p className="text-xs text-muted-foreground">of 10GB available</p>
                        </CardContent>
                    </Card>
                </div>

                {/* File Activity and Organization Features */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderOpen className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">proposal-draft.pdf</p>
                                            <p className="text-xs text-muted-foreground">Uploaded 2 hours ago</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">meeting-screenshot.png</p>
                                            <p className="text-xs text-muted-foreground">Organized 4 hours ago</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Video className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">presentation-demo.mp4</p>
                                            <p className="text-xs text-muted-foreground">Tagged yesterday</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Smart Organization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Auto-categorization</p>
                                        <p className="text-xs text-muted-foreground">Files automatically sorted by type and content</p>
                                    </div>
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Duplicate detection</p>
                                        <p className="text-xs text-muted-foreground">Automatically finds and manages duplicate files</p>
                                    </div>
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Smart tagging</p>
                                        <p className="text-xs text-muted-foreground">AI-powered content analysis and tagging</p>
                                    </div>
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coming Soon Notice */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Advanced File Management Coming Soon</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Full file organization features including drag-and-drop uploads, advanced search,
                                smart categorization, and AI-powered file analysis will be available in the next update.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
