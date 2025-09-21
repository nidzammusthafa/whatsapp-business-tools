import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIMessage } from "@/types/ai";
import { mockAISettings } from "@/lib/ai-mock-data";
import { toast } from "sonner";

interface AIChatInterfaceProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  isPreview?: boolean;
}

export function AIChatInterface({
  messages,
  onSendMessage,
  isTyping = false,
  isPreview = false,
}: AIChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (isPreview) return;

    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    if (isPreview) return;

    navigator.clipboard.writeText(text);
    toast("Pesan telah disalin ke clipboard");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const regenerateResponse = (messageId: string) => {
    if (isPreview) return;

    toast("Fitur regenerate response akan segera tersedia");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b bg-gradient-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Asisten Virtual Display Jabar</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[500px] p-4">
          <div className="space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                    <p className="text-sm">{mockAISettings.welcomeMessage}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI Assistant
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                {message.role === "user" ? (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 text-right">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none inline-block max-w-[80%]">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.timestamp).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none group relative">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {/* Message Actions */}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2"
                            onClick={() => copyToClipboard(message.content)}
                            disabled={isPreview}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2"
                            onClick={() => regenerateResponse(message.id)}
                            disabled={isPreview}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI Assistant •{" "}
                        {new Date(message.timestamp).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        AI sedang mengetik...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isPreview
                  ? "Mode preview - input dinonaktifkan"
                  : "Ketik pesan Anda..."
              }
              disabled={isPreview || isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isPreview || !inputMessage.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {isPreview && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Mode preview aktif - semua interaksi dinonaktifkan
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
