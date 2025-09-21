import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Thermometer,
  Trash2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface WarmerMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  direction: "sent" | "received";
}

interface WarmerProgressTableProps {
  sessionId: string;
  clientId: string;
  targetClientId: string;
  status: string;
  duration: number;
  messagesSent: number;
  startedAt: string;
  messages: WarmerMessage[];
  getClientName: (clientId: string) => string;
  getClientAvatar: (clientId: string) => string | undefined;
  onDelete?: (sessionId: string) => void;
}

export function WarmerProgressTable({
  sessionId,
  clientId,
  targetClientId,
  status,
  duration,
  messagesSent,
  startedAt,
  messages,
  getClientName,
  getClientAvatar,
  onDelete,
}: WarmerProgressTableProps) {
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentMessageCount, setCurrentMessageCount] = useState(messagesSent);

  // Simulate real-time message updates for active sessions
  useEffect(() => {
    if (status === "active") {
      const interval = setInterval(() => {
        // Add new message occasionally
        if (Math.random() > 0.7) {
          const isFromClient = Math.random() > 0.5;
          const newMessage: WarmerMessage = {
            id: Date.now().toString(),
            from: isFromClient ? clientId : targetClientId,
            to: isFromClient ? targetClientId : clientId,
            message: getRandomWarmerMessage(),
            timestamp: new Date().toISOString(),
            direction: isFromClient ? "sent" : "received",
          };

          setCurrentMessages((prev) => [newMessage, ...prev].slice(0, 100));
          setCurrentMessageCount((prev) => prev + 1);
        }
      }, 5000 + Math.random() * 10000); // Random interval 5-15 seconds

      return () => clearInterval(interval);
    }
  }, [status, clientId, targetClientId]);

  const getRandomWarmerMessage = () => {
    const messages = [
      "Hey, how's your day going?",
      "Just checking in! How are things?",
      "Hope you're having a great day! 😊",
      "What's new with you?",
      "Thinking of you! How are you doing?",
      "Good morning! Hope your day starts well!",
      "Any exciting plans for today?",
      "Hope you're doing well! 👋",
      "Just wanted to say hi!",
      "How's everything going on your end?",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / (1000 * 60)
  );
  const progressPercentage = Math.min((elapsedMinutes / duration) * 100, 100);
  const messagesPerHour =
    elapsedMinutes > 0
      ? Math.round((currentMessageCount / elapsedMinutes) * 60)
      : 0;

  const handleDelete = () => {
    onDelete?.(sessionId);
    setShowDeleteDialog(false);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Warmer Session Details
            </CardTitle>
            <CardDescription>
              Real-time conversation flow and warming progress
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Warmer Session</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this warming session? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Session Overview */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-muted/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getClientAvatar(clientId)} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getClientName(clientId)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{getClientName(clientId)}</p>
                <p className="text-sm text-muted-foreground">Source</p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground" />

            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getClientAvatar(targetClientId)} />
                <AvatarFallback className="bg-accent/10 text-accent">
                  {getClientName(targetClientId)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{getClientName(targetClientId)}</p>
                <p className="text-sm text-muted-foreground">Target</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <Badge
              className={
                status === "active" ? "status-online" : "status-warning"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-muted/5">
            <div className="text-2xl font-bold text-primary">
              {currentMessageCount}
            </div>
            <p className="text-sm text-muted-foreground">Messages Sent</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/5">
            <div className="text-2xl font-bold text-accent">
              {elapsedMinutes}m
            </div>
            <p className="text-sm text-muted-foreground">Elapsed Time</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/5">
            <div className="text-2xl font-bold text-success">
              {messagesPerHour}
            </div>
            <p className="text-sm text-muted-foreground">Msgs/Hour</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/5">
            <div className="text-2xl font-bold text-warning">
              {duration - elapsedMinutes}m
            </div>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Progress Bar */}
        {status === "active" && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Session Progress</span>
              <span>{progressPercentage.toFixed(1)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        )}

        {/* Message History */}
        <div className="border rounded-lg">
          <div className="p-4 border-b bg-muted/5">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Recent Warming Messages
            </h4>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMessages.slice(0, 20).map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={getClientAvatar(message.from)} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getClientName(message.from)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={getClientAvatar(message.to)} />
                          <AvatarFallback className="bg-accent/10 text-accent text-xs">
                            {getClientName(message.to)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-sm">
                      <p className="text-sm truncate">{message.message}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="status-online">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Delivered
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {currentMessages.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Warming conversation will appear here</p>
              </div>
            )}
          </div>

          {currentMessages.length > 20 && (
            <div className="p-4 text-center text-sm text-muted-foreground border-t">
              Showing 20 of {currentMessages.length} messages
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
