"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAppStore } from "@/stores/appStore";
import {
  Smartphone,
  Send,
  MessageSquare,
  TrendingUp,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  mockDashboardStats,
  mockClients,
  mockBlastCampaigns,
} from "@/lib/dummy-data";
import { toast } from "sonner";
import { EmptyState } from "../ui/empty-state";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { clients, campaigns } = useAppStore();

  const stats = mockDashboardStats;
  const displayClients = clients.length > 0 ? clients : mockClients;
  const displayCampaigns =
    campaigns.length > 0 ? campaigns : mockBlastCampaigns;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
    toast.success("Dashboard data refreshed!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="outline" className="status-online">
            Online
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="outline" className="status-offline">
            Offline
          </Badge>
        );
      case "scanning":
        return (
          <Badge variant="outline" className="status-warning">
            Scanning
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to WhatsApp Display Jabar - Your centralized WhatsApp
            management center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="hover:shadow-card transition-all duration-300"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button className="gradient-primary shadow-glow hover:shadow-elegant transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Quick Start
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Smartphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-success">
              {stats.connectedClients} connected
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Blasts</CardTitle>
            <Send className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBlasts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBlasts} total campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Today
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversationsToday}</div>
            <p className="text-xs text-muted-foreground">
              +
              {Math.round(
                (stats.conversationsToday / stats.messagesThisWeek) * 100
              )}
              % from avg
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Warmer Sessions
            </CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warmerSessions}</div>
            <p className="text-xs text-muted-foreground">Active sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Client Status Overview
            </CardTitle>
            <CardDescription>
              Current status of all WhatsApp clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayClients.length === 0 ? (
                <EmptyState
                  icon={Smartphone}
                  title="No clients connected"
                  description="Add your first WhatsApp client to get started"
                />
              ) : (
                displayClients.slice(0, 5).map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(client.status)}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {client.sentToday}/{client.dailyLimit}
                        </p>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                              width: `${
                                (client.sentToday / client.dailyLimit) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-accent" />
              Recent Blast Campaigns
            </CardTitle>
            <CardDescription>Latest campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayCampaigns.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="No campaigns yet"
                  description="Create your first blast campaign to reach your audience"
                />
              ) : (
                displayCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{campaign.name}</p>
                      <Badge
                        variant={
                          campaign.status === "completed"
                            ? "default"
                            : campaign.status === "running"
                            ? "secondary"
                            : campaign.status === "failed"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold">{campaign.stats.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-semibold text-success">
                          {campaign.stats.sent}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Delivered</p>
                        <p className="font-semibold text-primary">
                          {campaign.stats.delivered}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Failed</p>
                        <p className="font-semibold text-destructive">
                          {campaign.stats.failed}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-300"
                        style={{
                          width: `${
                            (campaign.stats.delivered / campaign.stats.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used functions for efficient workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CheckCircle className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">New Blast</h3>
              <p className="text-sm opacity-90">Create campaign</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-accent text-white hover:shadow-elegant transition-all duration-300 cursor-pointer">
              <Users className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Add Client</h3>
              <p className="text-sm opacity-90">Connect WhatsApp</p>
            </div>

            <div className="p-4 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer">
              <MessageSquare className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">View Chats</h3>
              <p className="text-sm text-muted-foreground">
                Manage conversations
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Check Numbers</h3>
              <p className="text-sm text-muted-foreground">Validate contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
