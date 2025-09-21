"use client";

import React, { useState } from "react";
import { Bot, Brain, MessageSquare, TrendingUp, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { AIPromptManager } from "@/components/ai/AIPromptManager";
import {
  mockAIConversations,
  mockAIInsights,
  mockAIFeatures,
  mockAISettings,
} from "@/lib/ai-mock-data";
import { AIMessage } from "@/types/ai";

export function AIAssistant() {
  const [activeMessages, setActiveMessages] = useState<AIMessage[]>(
    mockAIConversations[0]?.messages || []
  );
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    const newUserMessage: AIMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setActiveMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Terima kasih atas pertanyaan Anda! Saya sedang memproses permintaan ini dan akan memberikan respons yang relevan dengan kebutuhan WhatsApp management Anda.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setActiveMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Asisten virtual untuk mengoptimalkan komunikasi WhatsApp bisnis Anda
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Online
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Replies</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAIFeatures.smartReplyStats.accepted}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAIFeatures.smartReplyStats.acceptanceRate}% acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Analyzed
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAIFeatures.messageAnalysis.totalAnalyzed}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAIFeatures.messageAnalysis.sentimentBreakdown.positive}%
              positive sentiment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Content Generated
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAIFeatures.contentGeneration.templatesGenerated}
            </div>
            <p className="text-xs text-muted-foreground">
              +{mockAIFeatures.contentGeneration.avgEngagementIncrease}{" "}
              engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAIFeatures.smartReplyStats.timeSaved}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="templates">Template Prompt</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <AIChatInterface
                messages={activeMessages}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
              />
            </div>

            {/* Conversation History */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Percakapan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockAIConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setActiveMessages(conversation.messages)}
                    >
                      <h4 className="font-medium text-sm">
                        {conversation.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.messages.length} pesan •{" "}
                        {new Date(conversation.updatedAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  ))}
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
                  >
                    Analisis Sentiment Pesan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Generate Template Promo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Buat Sales Script
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Optimasi Response Time
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <AIPromptManager />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockAIInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {insight.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{insight.value}</span>
                    {insight.trend && (
                      <Badge
                        variant={
                          insight.trend === "up"
                            ? "default"
                            : insight.trend === "down"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {insight.trend === "up"
                          ? "↑"
                          : insight.trend === "down"
                          ? "↓"
                          : "→"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analytics */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Breakdown sentiment pesan masuk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Positif</span>
                    <span>
                      {
                        mockAIFeatures.messageAnalysis.sentimentBreakdown
                          .positive
                      }
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      mockAIFeatures.messageAnalysis.sentimentBreakdown.positive
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Netral</span>
                    <span>
                      {
                        mockAIFeatures.messageAnalysis.sentimentBreakdown
                          .neutral
                      }
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      mockAIFeatures.messageAnalysis.sentimentBreakdown.neutral
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Negatif</span>
                    <span>
                      {
                        mockAIFeatures.messageAnalysis.sentimentBreakdown
                          .negative
                      }
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      mockAIFeatures.messageAnalysis.sentimentBreakdown.negative
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Keywords</CardTitle>
                <CardDescription>
                  Kata kunci yang paling sering muncul
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockAIFeatures.messageAnalysis.topKeywords.map(
                    (keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Konfigurasi model dan behavior AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Model ID</label>
                  <p className="text-sm text-muted-foreground">
                    {mockAISettings.modelId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Temperature</label>
                  <p className="text-sm text-muted-foreground">
                    {mockAISettings.temperature}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Tokens</label>
                  <p className="text-sm text-muted-foreground">
                    {mockAISettings.maxTokens}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Auto Reply</label>
                  <p className="text-sm text-muted-foreground">
                    {mockAISettings.autoReply ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-medium">System Prompt</label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {mockAISettings.systemPrompt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enabled Features</CardTitle>
              <CardDescription>
                Fitur AI yang aktif dalam aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(mockAISettings.enabledFeatures).map(
                  ([key, enabled]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <Badge variant={enabled ? "default" : "secondary"}>
                        {enabled ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
