"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Message } from "@/types";
import {
  Send,
  MessageSquare,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Filter,
  Star,
  Archive,
} from "lucide-react";
import { mockConversations } from "@/lib/dummy-data";
import { toast } from "sonner";

export default function Conversations() {
  const [conversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      conversationId: "1",
      content: "Halo, saya tertarik dengan produk Display Jabar",
      type: "text",
      direction: "incoming",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: "read",
    },
    {
      id: "m2",
      conversationId: "1",
      content: "Terima kasih atas layanannya, sangat membantu!",
      type: "text",
      direction: "incoming",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "read",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contactNumber.includes(searchTerm)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMsg = {
        id: Date.now().toString(),
        conversationId: selectedConversation.id,
        content: newMessage,
        type: "text" as const,
        direction: "outgoing" as const,
        timestamp: new Date().toISOString(),
        status: "sent" as const,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversation List */}
      <Card className="w-80 shadow-card">
        <CardContent className="p-0">
          <div className="p-4 border-b space-y-3">
            <SearchInput
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                All
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Starred
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Button>
            </div>
          </div>
          <div className="overflow-auto h-[calc(100vh-16rem)]">
            {filteredConversations.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No conversations found"
                description="Start a new conversation or check your search terms"
              />
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation?.id === conv.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {conv.contactName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {conv.contactName || conv.contactNumber}
                        </h3>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 shadow-card">
        <CardContent className="p-0 h-full flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConversation.contactName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedConversation.contactName || "Unknown"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.contactNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-auto bg-muted/20">
                <div className="space-y-4">
                  {messages
                    .filter(
                      (msg) => msg.conversationId === selectedConversation.id
                    )
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.direction === "outgoing"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                            message.direction === "outgoing"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border shadow-card"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                            {message.direction === "outgoing" && (
                              <Badge
                                variant="secondary"
                                className={`text-xs h-4 ${
                                  message.status === "delivered"
                                    ? "bg-success/20 text-success"
                                    : message.status === "read"
                                    ? "bg-primary/20 text-primary"
                                    : message.status === "failed"
                                    ? "bg-destructive/20 text-destructive"
                                    : "bg-muted"
                                }`}
                              >
                                {message.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm" className="mb-2">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="min-h-[40px] resize-none"
                      disabled={isSending}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="mb-2">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    className="gradient-primary mb-2"
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.trim()}
                  >
                    {isSending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
