"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { LoadingSpinner, LoadingCard } from "@/components/ui/loading-spinner";
import { useAppStore } from "@/stores/appStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Smartphone,
  Wifi,
  WifiOff,
  AlertTriangle,
  QrCode,
  Settings,
  Trash2,
  RefreshCw,
  Star,
} from "lucide-react";
import { mockClients } from "@/lib/dummy-data";
import { toast } from "sonner";
import { EmptyState } from "../ui/empty-state";
import Image from "next/image";

export default function ClientManagement() {
  const { clients, updateClient, addClient, isLoading, setLoading } =
    useAppStore();
  const [showQRDialog, setShowQRDialog] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize with mock data if store is empty
  useEffect(() => {
    if (clients.length === 0) {
      mockClients.forEach((client) => addClient(client));
    }
  }, [clients.length, addClient]);

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4 text-success" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-muted-foreground" />;
      case "scanning":
        return <QrCode className="h-4 w-4 text-warning animate-pulse" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Smartphone className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="status-online">Connected</Badge>;
      case "disconnected":
        return (
          <Badge variant="secondary" className="status-offline">
            Disconnected
          </Badge>
        );
      case "scanning":
        return (
          <Badge variant="outline" className="status-warning">
            Scanning QR
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="status-error">
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = Math.round(rating / 20); // Convert 0-100 to 0-5 stars
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < stars ? "text-warning fill-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const handleConnect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setShowQRDialog(true);
    }
  };

  const handleDisconnect = async (clientId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateClient(clientId, { status: "disconnected" });
      toast.success("Client disconnected successfully");
    } catch {
      toast.error("Failed to disconnect client");
    } finally {
      setLoading(false);
    }
  };

  const connectedCount = clients.filter((c) => c.status === "connected").length;
  const totalSentToday = clients.reduce(
    (sum, client) => sum + client.sentToday,
    0
  );
  const totalDailyLimit = clients.reduce(
    (sum, client) => sum + client.dailyLimit,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Client Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your WhatsApp client connections
          </p>
        </div>
        <Button className="gradient-primary shadow-glow hover:shadow-elegant transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search clients..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredClients.length} of {clients.length} clients
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Clients
            </CardTitle>
            <Wifi className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectedCount}/{clients.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((connectedCount / clients.length) * 100)}% uptime
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Sent Today
            </CardTitle>
            <Smartphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSentToday.toLocaleString()}
            </div>
            <Progress
              value={(totalSentToday / totalDailyLimit) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Capacity
            </CardTitle>
            <Settings className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDailyLimit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                ((totalDailyLimit - totalSentToday) / totalDailyLimit) *
                100
              ).toFixed(1)}
              % remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Cards */}
      <div className="grid gap-4">
        {isLoading && clients.length === 0 ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <LoadingCard />
              </CardContent>
            </Card>
          ))
        ) : filteredClients.length === 0 ? (
          <EmptyState
            icon={Smartphone}
            title="No clients found"
            description={
              searchTerm
                ? "Try adjusting your search criteria"
                : "Add your first WhatsApp client to get started"
            }
            action={{
              label: "Add New Client",
              onClick: () => console.log("Add client"),
            }}
          />
        ) : (
          filteredClients.map((client) => (
            <Card
              key={client.id}
              className="shadow-card hover:shadow-elegant transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        {getStatusIcon(client.status)}
                        {getStatusBadge(client.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {client.phoneNumber}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground mr-1">
                          Health:
                        </span>
                        {getRatingStars(client.rating)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({client.rating}/100)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Usage Stats */}
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="font-semibold">
                          {client.sentToday}
                        </span>
                        <span className="text-muted-foreground">
                          /{client.dailyLimit}
                        </span>
                      </div>
                      <Progress
                        value={(client.sentToday / client.dailyLimit) * 100}
                        className="w-24"
                      />
                      <p className="text-xs text-muted-foreground">
                        {client.lastSeen &&
                          new Date(client.lastSeen).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {client.status === "connected" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(client.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <WifiOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </>
                      ) : client.status === "scanning" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(client.id)}
                          className="text-warning border-warning"
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          Show QR
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(client.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect WhatsApp Client</DialogTitle>
            <DialogDescription>
              Scan this QR code with your WhatsApp mobile app to connect{" "}
              {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-6">
            <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
              {selectedClient?.qrCode ? (
                <Image
                  src={selectedClient.qrCode}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center space-y-2">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Generating QR Code...
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              1. Open WhatsApp on your phone
            </p>
            <p className="text-sm text-muted-foreground">
              2. Go to Settings → Linked Devices
            </p>
            <p className="text-sm text-muted-foreground">
              3. Tap &quot;Link a Device&quot; and scan this code
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
