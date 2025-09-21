"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/ui/file-upload";
import { SearchInput } from "@/components/ui/search-input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAppStore } from "@/stores/appStore";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Send,
  FileText,
  Play,
  Pause,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  mockBlastCampaigns,
  mockTemplates,
  mockClients,
} from "@/lib/dummy-data";
import { toast } from "sonner";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  selectedClients: z.array(z.string()).min(1, "Select at least one client"),
  scheduledDate: z.string().optional(),
  sendingSpeed: z.enum(["slow", "normal", "fast"]),
});

export default function WhatsAppBlast() {
  const { campaigns, addCampaign, deleteCampaign, isLoading, setLoading } =
    useAppStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setExpandedCampaigns] = useState<Set<string>>(new Set());

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      message: "",
      selectedClients: [],
      scheduledDate: "",
      sendingSpeed: "normal",
    },
  });

  // Initialize with mock data if store is empty
  useEffect(() => {
    if (campaigns.length === 0) {
      mockBlastCampaigns.forEach((campaign) => addCampaign(campaign));
    }
  }, [campaigns.length, addCampaign]);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "running":
        return <Play className="h-4 w-4 text-primary animate-pulse" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "draft":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="status-online">Completed</Badge>;
      case "running":
        return (
          <Badge className="bg-primary text-primary-foreground">Running</Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="status-warning">
            Scheduled
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (template) {
      form.setValue("message", template.content);
    }
  };

  const onSubmit = async (values: z.infer<typeof campaignSchema>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newCampaign = {
        id: Date.now().toString(),
        name: values.name,
        status: "draft" as const,
        template: {
          id: "custom-" + Date.now(),
          name: "Custom Message",
          content: values.message,
          createdAt: new Date().toISOString(),
        },
        targets: [],
        clientIds: values.selectedClients,
        scheduledAt: values.scheduledDate || undefined,
        createdAt: new Date().toISOString(),
        stats: {
          total: 0,
          sent: 0,
          delivered: 0,
          failed: 0,
          pending: 0,
        },
      };

      addCampaign(newCampaign);
      toast.success("Campaign created successfully!");
      setShowCreateDialog(false);
      form.reset();
    } catch {
      toast.error("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files: File[]) => {
    toast.success(`Uploaded ${files.length} contact file(s)`);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    deleteCampaign(campaignId);
    toast.success("Campaign deleted successfully!");
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      newSet.delete(campaignId);
      return newSet;
    });
  };

  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "running"
  ).length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.stats.sent, 0);
  const totalDelivered = campaigns.reduce(
    (sum, c) => sum + c.stats.delivered,
    0
  );
  const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">WhatsApp Blast</h1>
          <p className="text-muted-foreground">
            Create and manage mass messaging campaigns
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow hover:shadow-elegant transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blast Campaign</DialogTitle>
              <DialogDescription>
                Set up a new mass messaging campaign for your WhatsApp clients
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="message" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="message">Message</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="message" className="space-y-4">
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter campaign name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Message Template</Label>
                      <Select onValueChange={handleTemplateSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template or create new" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here..."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Use variables like {"{nama}"} for personalization
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select WhatsApp Clients</Label>
                    <div className="grid gap-2">
                      {mockClients
                        .filter((c) => c.status === "connected")
                        .map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center space-x-2 p-2 border rounded"
                          >
                            <input type="checkbox" defaultChecked />
                            <span className="font-medium">{client.name}</span>
                            <span className="text-sm text-muted-foreground">
                              ({client.phoneNumber})
                            </span>
                            <Badge variant="outline" className="ml-auto">
                              {client.dailyLimit - client.sentToday} available
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Contact List</Label>
                    <FileUpload
                      onFileUpload={handleFileUpload}
                      accept={{
                        "text/csv": [".csv"],
                        "application/vnd.ms-excel": [".xlsx"],
                      }}
                      maxFiles={1}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scheduling Options</Label>
                    <Select defaultValue="now">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Now</SelectItem>
                        <SelectItem value="scheduled">
                          Schedule for Later
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Sending Speed</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow (1 msg/sec)</SelectItem>
                          <SelectItem value="normal">
                            Normal (3 msg/sec)
                          </SelectItem>
                          <SelectItem value="fast">Fast (5 msg/sec)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Retry Failed</Label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes (3 attempts)</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                    className="gradient-primary"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : null}
                    Create Campaign
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search campaigns..."
        value={searchTerm}
        onChange={setSearchTerm}
        className="max-w-sm"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <Play className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalDelivered} delivered
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Campaign History
          </CardTitle>
          <CardDescription>
            Manage and monitor your blast campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 rounded-lg border hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(campaign.status)}
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created{" "}
                        {new Date(campaign.createdAt).toLocaleDateString()}
                        {campaign.scheduledAt &&
                          ` • Scheduled for ${new Date(
                            campaign.scheduledAt
                          ).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(campaign.status)}
                    {campaign.status === "running" && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-5 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{campaign.stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {campaign.stats.sent}
                    </p>
                    <p className="text-xs text-muted-foreground">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {campaign.stats.delivered}
                    </p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">
                      {campaign.stats.failed}
                    </p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {campaign.stats.pending}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                <Progress
                  value={
                    campaign.stats.total > 0
                      ? (campaign.stats.sent / campaign.stats.total) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
