"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Thermometer,
  Play,
  Pause,
  Square,
  Activity,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
} from "lucide-react";
import {
  mockWarmerSessions,
  mockClients,
  mockWarmerMessages,
} from "@/lib/dummy-data";
import { toast } from "sonner";
import { WarmerProgressTable } from "../ui/warmer-progress-table";

export default function WhatsAppWarmer() {
  const [sessions, setSessions] = useState(mockWarmerSessions);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [targetClient, setTargetClient] = useState("");
  const [duration, setDuration] = useState("60");
  const [messageInterval, setMessageInterval] = useState("5");
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );

  const connectedClients = mockClients.filter((c) => c.status === "connected");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-success animate-pulse" />;
      case "paused":
        return <Pause className="h-4 w-4 text-warning" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      default:
        return <Square className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="status-online">Active</Badge>;
      case "paused":
        return (
          <Badge variant="outline" className="status-warning">
            Paused
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client?.name || "Unknown Client";
  };

  const getClientAvatar = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client?.avatar;
  };

  const handleStartSession = () => {
    if (selectedClient && targetClient && selectedClient !== targetClient) {
      const newSession = {
        id: (sessions.length + 1).toString(),
        clientId: selectedClient,
        targetClientId: targetClient,
        status: "active" as const,
        startedAt: new Date().toISOString(),
        duration: parseInt(duration),
        messagesSent: 0,
        lastActivity: new Date().toISOString(),
      };
      setSessions([...sessions, newSession]);
      setShowCreateDialog(false);
      setSelectedClient("");
      setTargetClient("");
    }
  };

  const handlePauseSession = (sessionId: string) => {
    setSessions(
      sessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: "paused" as const }
          : session
      )
    );
  };

  const handleResumeSession = (sessionId: string) => {
    setSessions(
      sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: "active" as const,
              lastActivity: new Date().toISOString(),
            }
          : session
      )
    );
  };

  const handleStopSession = (sessionId: string) => {
    setSessions(
      sessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: "completed" as const }
          : session
      )
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast.success("Warmer session deleted successfully!");
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(sessionId);
      return newSet;
    });
  };

  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalMessages = sessions.reduce((sum, s) => sum + s.messagesSent, 0);
  const avgDuration =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            WhatsApp Warmer
          </h1>
          <p className="text-muted-foreground">
            Warm up your WhatsApp numbers to maintain account health and avoid
            restrictions
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow hover:shadow-elegant transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Start Warmer Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Warmer Session</DialogTitle>
              <DialogDescription>
                Configure a warming session between two WhatsApp clients to
                improve account health
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Source Client</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client to warm up" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.phoneNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Client</Label>
                <Select value={targetClient} onValueChange={setTargetClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target client" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedClients
                      .filter((c) => c.id !== selectedClient)
                      .map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.phoneNumber})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="10"
                    max="480"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Message Interval (minutes)</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={messageInterval}
                    onChange={(e) => setMessageInterval(e.target.value)}
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartSession}
                  disabled={
                    !selectedClient ||
                    !targetClient ||
                    selectedClient === targetClient
                  }
                  className="gradient-primary"
                >
                  Start Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions}</div>
            <p className="text-xs text-muted-foreground">Currently warming</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Warming messages sent
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Session Time
            </CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgDuration)}m</div>
            <p className="text-xs text-muted-foreground">Average duration</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning Card */}
      <Card className="border-warning bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              • Warming sessions help maintain account health by simulating
              natural conversation patterns
            </p>
            <p>
              • Use this feature for new numbers or accounts that haven&apos;t
              been active recently
            </p>
            <p>• Recommended: 30-60 minutes per session, 2-3 times per week</p>
            <p>
              • Avoid excessive warming which may trigger WhatsApp&apos;s
              anti-spam measures
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Warmer Sessions
          </CardTitle>
          <CardDescription>
            Monitor and control your active warming sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Thermometer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No warming sessions yet</p>
                <p className="text-sm text-muted-foreground">
                  Start your first session to improve account health
                </p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg border hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={getClientAvatar(session.clientId)}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getClientName(session.clientId)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {getClientName(session.clientId)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>→</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={getClientAvatar(session.targetClientId)}
                          />
                          <AvatarFallback className="bg-accent/10 text-accent text-sm">
                            {getClientName(session.targetClientId)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {getClientName(session.targetClientId)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.status)}
                      {getStatusBadge(session.status)}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {session.duration}m
                      </p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {session.messagesSent}
                      </p>
                      <p className="text-xs text-muted-foreground">Messages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {new Date(session.startedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Started</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {session.lastActivity
                          ? new Date(session.lastActivity).toLocaleTimeString()
                          : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last Activity
                      </p>
                    </div>
                  </div>

                  {session.status === "active" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {Math.round(
                            (session.messagesSent / (session.duration / 5)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (session.messagesSent / (session.duration / 5)) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSessionExpansion(session.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedSessions.has(session.id)
                        ? "Hide Details"
                        : "View Details"}
                    </Button>

                    {session.status === "active" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePauseSession(session.id)}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStopSession(session.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Square className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      </>
                    )}

                    {session.status === "paused" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResumeSession(session.id)}
                          className="text-success hover:bg-success hover:text-success-foreground"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStopSession(session.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Square className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Expanded Session Details */}
                  {expandedSessions.has(session.id) && (
                    <div className="mt-4">
                      <WarmerProgressTable
                        sessionId={session.id}
                        clientId={session.clientId}
                        targetClientId={session.targetClientId}
                        status={session.status}
                        duration={session.duration}
                        messagesSent={session.messagesSent}
                        startedAt={session.startedAt}
                        messages={
                          mockWarmerMessages[
                            session.id as keyof typeof mockWarmerMessages
                          ] || []
                        }
                        getClientName={getClientName}
                        getClientAvatar={getClientAvatar}
                        onDelete={handleDeleteSession}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
