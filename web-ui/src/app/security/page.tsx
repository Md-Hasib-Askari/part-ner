"use client";

import { MainLayout } from '@/components/templates/main-layout';
import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/molecules/stat-card';
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Wifi,
    Lock,
    Eye,
    Activity,
    RefreshCw,
    Settings
} from 'lucide-react';

export default function SecurityPage() {
    const { setCurrentPage } = useAppStore();

    useEffect(() => {
        setCurrentPage('security');
    }, [setCurrentPage]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Network Security Monitor</h1>
                        <p className="text-muted-foreground mt-1">
                            Real-time monitoring of network connections and security threats.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                        </Button>
                    </div>
                </div>

                {/* Security Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Security Status"
                        value="Protected"
                        description="All systems secure"
                        trend={{ value: 0, label: "Stable", isPositive: true }}
                        variant="success"
                        icon={Shield}
                    />

                    <StatCard
                        title="Active Connections"
                        value="23"
                        description="Network connections"
                        trend={{ value: -2, label: "-2 from 1h ago", isPositive: true }}
                        variant="default"
                        icon={Wifi}
                    />

                    <StatCard
                        title="Threats Blocked"
                        value="5"
                        description="Last 24 hours"
                        trend={{ value: 15, label: "+15%", isPositive: true }}
                        variant="warning"
                        icon={AlertTriangle}
                    />

                    <StatCard
                        title="VPN Status"
                        value="Connected"
                        description="Secure tunnel active"
                        trend={{ value: 0, label: "99.9% uptime", isPositive: true }}
                        variant="success"
                        icon={Lock}
                    />
                </div>

                {/* Security Monitoring Dashboard */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Recent Security Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Firewall scan completed</p>
                                        <p className="text-xs text-muted-foreground">No threats detected • 2 min ago</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Suspicious connection blocked</p>
                                        <p className="text-xs text-muted-foreground">IP: 192.168.1.45 • 15 min ago</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">VPN connection established</p>
                                        <p className="text-xs text-muted-foreground">Server: US-East-1 • 1 hour ago</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Malware attempt detected</p>
                                        <p className="text-xs text-muted-foreground">Blocked and quarantined • 3 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wifi className="h-5 w-5" />
                                Active Network Connections
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">gmail.com</p>
                                            <p className="text-xs text-muted-foreground">HTTPS • Email sync</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-600">Secure</span>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">github.com</p>
                                            <p className="text-xs text-muted-foreground">HTTPS • Development</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-600">Secure</span>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">cdn.jsdelivr.net</p>
                                            <p className="text-xs text-muted-foreground">HTTPS • CDN</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-blue-600">Active</span>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">api.openai.com</p>
                                            <p className="text-xs text-muted-foreground">HTTPS • AI Services</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-yellow-600">Monitored</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Security Features */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Protection Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Firewall</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-green-600">Active</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Antivirus</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-green-600">Updated</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">VPN</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-green-600">Connected</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">DNS Filtering</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-green-600">Enabled</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Threat Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Risk Level</span>
                                    <span className="text-sm font-medium text-green-600">Low</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Last Scan</span>
                                    <span className="text-sm font-medium">2 min ago</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Threats Today</span>
                                    <span className="text-sm font-medium">5 blocked</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Network Score</span>
                                    <span className="text-sm font-medium text-green-600">98/100</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Privacy Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Data Encryption</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Tracking Protection</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Secure DNS</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Auto-Updates</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coming Soon Notice */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Advanced Security Features Coming Soon</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Enhanced network monitoring, intrusion detection, vulnerability scanning,
                                and comprehensive security reporting will be available in future updates.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
