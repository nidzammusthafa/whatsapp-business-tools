"use client";

import React from "react";
import {
  Bot,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Wifi,
  WifiOff,
  QrCode,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  mockClients,
  mockBlastCampaigns,
  mockWarmerSessions,
  mockNumberChecks,
  mockConversations,
  mockTemplates,
  mockDashboardStats,
} from "@/lib/dummy-data";
import { mockAIConversations } from "@/lib/ai-mock-data";
import { mockAddresses } from "@/lib/mock-addresses";
import { DataTable } from "@/components/ui/data-table";
import { AIChatInterface } from "@/components/ai/AIChatInterface";

export default function Preview() {
  // Data untuk tabel

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversationsData = mockConversations.map((conv) => ({
    contact: conv.contactName,
    phone: conv.contactNumber,
    lastMessage: conv.lastMessage.content.substring(0, 50) + "...",
    unread: conv.unreadCount,
    time: new Date(conv.updatedAt).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const blastData = mockBlastCampaigns.map((campaign) => ({
    name: campaign.name,
    status: campaign.status,
    total: campaign.stats.total,
    sent: campaign.stats.sent,
    delivered: campaign.stats.delivered,
    failed: campaign.stats.failed,
  }));

  const addressData = mockAddresses.slice(0, 6).map((address) => ({
    name: address.name,
    phone: address.phoneNumber,
    city: address.city || "-",
    rating: address.rating || "-",
    business: address.isBusiness ? "Ya" : "Tidak",
  }));

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { variant: "default", icon: Wifi, label: "Online" },
      disconnected: { variant: "destructive", icon: WifiOff, label: "Offline" },
      scanning: { variant: "secondary", icon: QrCode, label: "Scanning" },
      error: { variant: "destructive", icon: AlertCircle, label: "Error" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
    const Icon = config.icon;

    return (
      <Badge
        variant={
          config.variant as
            | "default"
            | "destructive"
            | "secondary"
            | "outline"
            | null
            | undefined
        }
        className="gap-1"
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8 bg-gradient-primary text-primary-foreground rounded-lg">
        <h1 className="text-4xl font-bold">Preview Dashboard Display Jabar</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Tur visual interaktif dari semua fitur aplikasi manajemen WhatsApp
          bisnis
        </p>
        <Badge variant="secondary" className="text-sm">
          Mode Preview - Semua fungsi dinonaktifkan
        </Badge>
      </div>

      {/* Section 1: Multi-Account Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Manajemen Multi-Akun WhatsApp</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {mockClients.slice(0, 3).map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{client.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {client.phoneNumber}
                  </CardDescription>
                </div>
                {getStatusBadge(client.status)}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Terkirim hari ini:</span>
                    <span className="font-medium">
                      {client.sentToday}/{client.dailyLimit}
                    </span>
                  </div>
                  <Progress
                    value={(client.sentToday / client.dailyLimit) * 100}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Rating: {client.rating}%</span>
                    <span>Limit: {client.dailyLimit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 2: Unified Inbox */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            Dasbor Pesan Terpusat (Unified Inbox)
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle className="text-lg">Percakapan</CardTitle>
                <CardDescription>
                  Semua pesan dari berbagai akun
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 overflow-y-auto">
                {mockConversations.slice(0, 5).map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">
                          {conv.contactName}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(conv.updatedAt).toLocaleTimeString("id-ID")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <AIChatInterface
              messages={mockAIConversations[0]?.messages || []}
              onSendMessage={() => {}}
              isPreview={true}
            />
          </div>
        </div>
      </section>

      {/* Section 3: WhatsApp Blast */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Send className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">WhatsApp Blast (Pesan Massal)</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Progres Kampanye Blast</CardTitle>
                <CardDescription>
                  Status pengiriman pesan massal real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={blastData}
                  columns={[
                    { key: "name", header: "Nama Kampanye" },
                    {
                      key: "status",
                      header: "Status",
                      render: (value) => (
                        <Badge
                          variant={
                            value === "completed"
                              ? "default"
                              : value === "running"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {value}
                        </Badge>
                      ),
                    },
                    { key: "sent", header: "Terkirim" },
                    { key: "delivered", header: "Delivered" },
                    { key: "failed", header: "Gagal" },
                  ]}
                  searchable={false}
                  paginated={false}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Pesan</span>
                    <span className="font-medium">
                      {mockDashboardStats.totalMessages}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Minggu Ini</span>
                    <span className="font-medium">
                      {mockDashboardStats.messagesThisWeek}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blast Aktif</span>
                    <span className="font-medium">
                      {mockDashboardStats.activeBlasts}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  Buat Blast Baru
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  Lihat Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  Analisis Performa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: WA Warmer */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Pemanasan Akun (WA Warmer)</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sesi Pemanasan Aktif</CardTitle>
            <CardDescription>
              Log percakapan otomatis antar akun untuk meningkatkan reputasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWarmerSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          session.status === "active" ? "default" : "secondary"
                        }
                      >
                        {session.status}
                      </Badge>
                      <span className="font-medium">
                        Client {session.clientId} → Client{" "}
                        {session.targetClientId}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.messagesSent} pesan terkirim • Durasi:{" "}
                      {session.duration} menit
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.lastActivity
                      ? new Date(session.lastActivity).toLocaleTimeString(
                          "id-ID"
                        )
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 5: Number Checker */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            Pemeriksa Nomor (Number Checker)
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Pemeriksaan Nomor</CardTitle>
            <CardDescription>
              Status validitas dan ketersediaan WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNumberChecks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <span className="font-medium">{check.phoneNumber}</span>
                    {check.about && (
                      <p className="text-sm text-muted-foreground">
                        {check.about}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={check.isValid ? "default" : "destructive"}>
                      {check.isValid ? "Valid" : "Invalid"}
                    </Badge>
                    <Badge
                      variant={check.hasWhatsApp ? "default" : "secondary"}
                    >
                      {check.hasWhatsApp ? "WhatsApp" : "No WA"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 6: Contact & Template Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Manajemen Kontak & Template</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Address Book Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buku Alamat</CardTitle>
              <CardDescription>Database kontak terintegrasi</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={addressData}
                columns={[
                  { key: "name", header: "Nama" },
                  { key: "phone", header: "Telepon" },
                  { key: "city", header: "Kota" },
                  { key: "rating", header: "Rating" },
                  { key: "business", header: "Bisnis" },
                ]}
                searchable={false}
                paginated={false}
                pageSize={5}
              />
            </CardContent>
          </Card>

          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Pesan</CardTitle>
              <CardDescription>
                Template siap pakai untuk berbagai keperluan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {template.variables?.length || 0} variabel
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Terakhir digunakan:{" "}
                    {template.lastUsed
                      ? new Date(template.lastUsed).toLocaleDateString("id-ID")
                      : "Belum pernah"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 7: AI Assistant Preview */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Assistant</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Chat Interface</CardTitle>
              <CardDescription>
                Asisten virtual untuk optimasi komunikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-background p-2 rounded-lg text-sm">
                    Halo! Saya dapat membantu Anda menganalisis performa
                    kampanye dan memberikan saran untuk meningkatkan engagement.
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground p-2 rounded-lg text-sm max-w-[80%]">
                    Bagaimana cara meningkatkan response rate untuk campaign
                    promo?
                  </div>
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Users className="h-3 w-3 text-accent-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Prompt Templates</CardTitle>
              <CardDescription>
                Template prompt siap pakai untuk berbagai kebutuhan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">
                    Template Pesan Promosi
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate pesan promosi yang menarik untuk produk atau
                    layanan
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Marketing
                  </Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">
                    Analisis Sentiment Pesan
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Analisis sentiment dan emosi dari pesan customer
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Customer Service
                  </Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">
                    Sales Script Generator
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate sales script untuk closing deal
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Sales
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 border-t">
        <p className="text-muted-foreground">
          Preview Dashboard Display Jabar - Semua data yang ditampilkan adalah
          data dummy untuk keperluan demonstrasi
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Dalam mode aktif, semua fungsi akan dapat digunakan dan terhubung
          dengan data real-time
        </p>
      </div>
    </div>
  );
}
