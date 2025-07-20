"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormInput } from '@/components/atoms/inputs';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Key,
    Database,
    Smartphone,
    Globe,
    HelpCircle,
    Save
} from 'lucide-react';

export default function SettingsPage() {
    const { setCurrentPage, user, theme } = useAppStore();

    useEffect(() => {
        setCurrentPage('settings');
    }, [setCurrentPage]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your preferences, security settings, and application configuration.
                        </p>
                    </div>

                    <Button size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    {/* Profile Settings */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormInput
                                        label="Full Name"
                                        value={user?.name || ''}
                                        placeholder="Enter your full name"
                                    />
                                    <FormInput
                                        label="Email Address"
                                        type="email"
                                        value={user?.email || ''}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <FormInput
                                    label="Job Title"
                                    placeholder="Enter your job title"
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormInput
                                        label="Company"
                                        placeholder="Enter your company"
                                    />
                                    <FormInput
                                        label="Location"
                                        placeholder="Enter your location"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>AI Assistant Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Voice Responses</p>
                                        <p className="text-sm text-muted-foreground">Enable voice responses from AI assistant</p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Smart Suggestions</p>
                                        <p className="text-sm text-muted-foreground">Show AI-powered suggestions and recommendations</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Learning Mode</p>
                                        <p className="text-sm text-muted-foreground">Allow AI to learn from your preferences</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notification Settings */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Task Reminders</p>
                                        <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Security Alerts</p>
                                        <p className="text-sm text-muted-foreground">Receive security and privacy alerts</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Financial Updates</p>
                                        <p className="text-sm text-muted-foreground">Budget and expense notifications</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5" />
                                    Push Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Browser Notifications</p>
                                        <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Sound Alerts</p>
                                        <p className="text-sm text-muted-foreground">Play sound for important notifications</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Settings */}
                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Theme & Display
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-medium mb-3">Theme</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className={`p-3 border rounded-lg cursor-pointer ${theme === 'light' ? 'border-primary' : ''}`}>
                                            <div className="w-full h-16 bg-white border rounded mb-2"></div>
                                            <p className="text-sm text-center">Light</p>
                                        </div>
                                        <div className={`p-3 border rounded-lg cursor-pointer ${theme === 'dark' ? 'border-primary' : ''}`}>
                                            <div className="w-full h-16 bg-gray-900 border rounded mb-2"></div>
                                            <p className="text-sm text-center">Dark</p>
                                        </div>
                                        <div className={`p-3 border rounded-lg cursor-pointer ${theme === 'system' ? 'border-primary' : ''}`}>
                                            <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 border rounded mb-2"></div>
                                            <p className="text-sm text-center">System</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Compact Mode</p>
                                        <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Animations</p>
                                        <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                    </div>
                                    <Button variant="outline" size="sm">Enable</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Session Timeout</p>
                                        <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Login Alerts</p>
                                        <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    API Keys & Integrations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormInput
                                    label="OpenAI API Key"
                                    type="password"
                                    placeholder="sk-..."
                                    helper="Required for AI chat functionality"
                                />

                                <FormInput
                                    label="Email API Key"
                                    type="password"
                                    placeholder="Enter your email service API key"
                                />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">GitHub Integration</p>
                                        <p className="text-sm text-muted-foreground">Connect your GitHub account</p>
                                    </div>
                                    <Button variant="outline" size="sm">Connect</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Settings */}
                    <TabsContent value="privacy" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Privacy & Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Data Collection</p>
                                        <p className="text-sm text-muted-foreground">Allow anonymous usage analytics</p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Crash Reports</p>
                                        <p className="text-sm text-muted-foreground">Send crash reports to help improve the app</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Data Encryption</p>
                                        <p className="text-sm text-muted-foreground">Encrypt sensitive data locally</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5" />
                                    Data Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Export Data</p>
                                        <p className="text-sm text-muted-foreground">Download all your data</p>
                                    </div>
                                    <Button variant="outline" size="sm">Export</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Clear Cache</p>
                                        <p className="text-sm text-muted-foreground">Clear temporary files and cache</p>
                                    </div>
                                    <Button variant="outline" size="sm">Clear</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-red-600">Delete Account</p>
                                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                                    </div>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Advanced Settings */}
                    <TabsContent value="advanced" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Advanced Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Developer Mode</p>
                                        <p className="text-sm text-muted-foreground">Enable advanced debugging features</p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Beta Features</p>
                                        <p className="text-sm text-muted-foreground">Access experimental features</p>
                                    </div>
                                    <Switch />
                                </div>

                                <FormInput
                                    label="API Endpoint"
                                    placeholder="https://api.example.com"
                                    helper="Custom API endpoint for advanced users"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5" />
                                    Support & Feedback
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Send Feedback</p>
                                        <p className="text-sm text-muted-foreground">Help us improve the application</p>
                                    </div>
                                    <Button variant="outline" size="sm">Feedback</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Contact Support</p>
                                        <p className="text-sm text-muted-foreground">Get help with any issues</p>
                                    </div>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Documentation</p>
                                        <p className="text-sm text-muted-foreground">View user guides and API docs</p>
                                    </div>
                                    <Button variant="outline" size="sm">View Docs</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
